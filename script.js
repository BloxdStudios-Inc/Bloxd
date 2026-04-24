const STORAGE_KEYS = {
  groups: "bloxdgroups.groups",
  codes: "bloxdgroups.codes",
  siteOwnerPassword: "bloxdgroups.siteOwnerPassword"
};

const DEFAULT_SITE_OWNER_PASSWORD = "bloxdhub-owner";

const state = {
  groups: [],
  codes: [],
  selectedGroupId: null,
  ownerSession: null,
  activeTab: "info",
  ownerPanelUnlocked: false
};

const el = {
  createForm: document.getElementById("createForm"),
  groupType: document.getElementById("groupType"),
  groupName: document.getElementById("groupName"),
  ownerName: document.getElementById("ownerName"),
  groupDescription: document.getElementById("groupDescription"),
  groupVisibility: document.getElementById("groupVisibility"),
  ownerCode: document.getElementById("ownerCode"),
  createMsg: document.getElementById("createMsg"),
  directory: document.getElementById("directory"),
  detailView: document.getElementById("detailView"),
  emptyState: document.getElementById("emptyState"),
  detailName: document.getElementById("detailName"),
  detailMeta: document.getElementById("detailMeta"),
  editBtn: document.getElementById("editBtn"),
  ownerLoginCode: document.getElementById("ownerLoginCode"),
  ownerLoginBtn: document.getElementById("ownerLoginBtn"),
  ownerLogoutBtn: document.getElementById("ownerLogoutBtn"),
  ownerLoginMsg: document.getElementById("ownerLoginMsg"),
  tabs: Array.from(document.querySelectorAll(".tab")),
  tabInfo: document.getElementById("tab-info"),
  tabMembers: document.getElementById("tab-members"),
  tabAnnouncements: document.getElementById("tab-announcements"),
  editorPanel: document.getElementById("editorPanel"),
  editName: document.getElementById("editName"),
  editVisibility: document.getElementById("editVisibility"),
  editDescription: document.getElementById("editDescription"),
  saveEditBtn: document.getElementById("saveEditBtn"),
  roleTarget: document.getElementById("roleTarget"),
  roleType: document.getElementById("roleType"),
  assignRoleBtn: document.getElementById("assignRoleBtn"),
  announcementText: document.getElementById("announcementText"),
  postAnnouncementBtn: document.getElementById("postAnnouncementBtn"),
  editMsg: document.getElementById("editMsg"),
  siteOwnerPassword: document.getElementById("siteOwnerPassword"),
  unlockOwnerPanel: document.getElementById("unlockOwnerPanel"),
  ownerPanel: document.getElementById("ownerPanel"),
  newCodeValue: document.getElementById("newCodeValue"),
  newCodeType: document.getElementById("newCodeType"),
  addCodeBtn: document.getElementById("addCodeBtn"),
  codeList: document.getElementById("codeList"),
  ownerMsg: document.getElementById("ownerMsg")
};

function init() {
  loadState();
  bindEvents();
  renderDirectory();
  renderDetail();
  renderCodeList();
}

function loadState() {
  state.groups = readJSON(STORAGE_KEYS.groups, []);
  state.codes = readJSON(STORAGE_KEYS.codes, [
    { code: "GROUP-STARTER", type: "group", usedByGroupId: null },
    { code: "ORG-STARTER", type: "organization", usedByGroupId: null }
  ]);

  if (!localStorage.getItem(STORAGE_KEYS.siteOwnerPassword)) {
    localStorage.setItem(STORAGE_KEYS.siteOwnerPassword, DEFAULT_SITE_OWNER_PASSWORD);
  }
}

function bindEvents() {
  el.createForm.addEventListener("submit", handleCreate);
  el.ownerLoginBtn.addEventListener("click", handleOwnerLogin);
  el.ownerLogoutBtn.addEventListener("click", logoutOwnerSession);
  el.editBtn.addEventListener("click", () => {
    el.editorPanel.classList.toggle("hidden");
  });

  el.tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      state.activeTab = tab.dataset.tab;
      renderTabs();
    });
  });

  el.saveEditBtn.addEventListener("click", handleSaveEdits);
  el.assignRoleBtn.addEventListener("click", handleAssignRole);
  el.postAnnouncementBtn.addEventListener("click", handlePostAnnouncement);

  el.unlockOwnerPanel.addEventListener("click", unlockOwnerPanel);
  el.addCodeBtn.addEventListener("click", addAccessCode);
}

function handleCreate(event) {
  event.preventDefault();

  const type = el.groupType.value;
  const name = el.groupName.value.trim();
  const ownerName = el.ownerName.value.trim();
  const description = el.groupDescription.value.trim();
  const visibility = el.groupVisibility.value;
  const ownerCode = el.ownerCode.value.trim();

  if (!name || !ownerName || !description || !ownerCode) {
    return setMessage(el.createMsg, "All fields are required.");
  }

  if (findGroupByName(name)) {
    return setMessage(el.createMsg, "This name is already taken. Pick another.");
  }

  const codeRecord = findCode(ownerCode);
  if (!codeRecord) {
    return setMessage(el.createMsg, "Invalid access code.");
  }

  if (codeRecord.usedByGroupId) {
    return setMessage(el.createMsg, "This code is already used by another group.");
  }

  if (type === "organization" && codeRecord.type !== "organization") {
    return setMessage(el.createMsg, "Organizations require an organization admin code.");
  }

  if (type === "group" && codeRecord.type !== "group" && codeRecord.type !== "organization") {
    return setMessage(el.createMsg, "Group owner code is required.");
  }

  const group = {
    id: crypto.randomUUID(),
    type,
    name,
    description,
    visibility,
    ownerName,
    ownerCode,
    createdAt: new Date().toISOString(),
    members: [{ name: ownerName, role: "owner" }],
    announcements: []
  };

  codeRecord.usedByGroupId = group.id;
  state.groups.unshift(group);
  state.selectedGroupId = group.id;
  state.ownerSession = { groupId: group.id };

  persist();
  renderAll();
  el.createForm.reset();
  setMessage(el.createMsg, "Created successfully.");
}

function handleOwnerLogin() {
  const group = getSelectedGroup();
  if (!group) return;

  const code = el.ownerLoginCode.value.trim();
  if (code === group.ownerCode) {
    state.ownerSession = { groupId: group.id };
    setMessage(el.ownerLoginMsg, `Owner login successful for ${group.name}.`);
    renderDetail();
  } else {
    setMessage(el.ownerLoginMsg, "Incorrect owner code.");
  }
}

function logoutOwnerSession() {
  state.ownerSession = null;
  el.editorPanel.classList.add("hidden");
  setMessage(el.ownerLoginMsg, "Owner logged out.");
  renderDetail();
}

function handleSaveEdits() {
  const group = requireOwner();
  if (!group) return;

  const nextName = el.editName.value.trim();
  const nextDescription = el.editDescription.value.trim();
  const nextVisibility = el.editVisibility.value;

  if (!nextName || !nextDescription) {
    return setMessage(el.editMsg, "Name and description cannot be empty.");
  }

  const duplicate = state.groups.find(item => item.id !== group.id && item.name.toLowerCase() === nextName.toLowerCase());
  if (duplicate) {
    return setMessage(el.editMsg, "Another group already has that name.");
  }

  group.name = nextName;
  group.description = nextDescription;
  group.visibility = nextVisibility;

  persist();
  renderAll();
  setMessage(el.editMsg, "Group updated.");
}

function handleAssignRole() {
  const group = requireOwner();
  if (!group) return;

  const targetName = el.roleTarget.value.trim();
  const newRole = el.roleType.value;

  if (!targetName) {
    return setMessage(el.editMsg, "Enter a member name.");
  }

  const member = group.members.find(m => m.name.toLowerCase() === targetName.toLowerCase());
  if (!member) {
    return setMessage(el.editMsg, "Member not found in this group.");
  }

  if (member.role === "owner") {
    return setMessage(el.editMsg, "Cannot change owner role.");
  }

  member.role = newRole;
  persist();
  renderDetail();
  setMessage(el.editMsg, `${member.name} updated to ${newRole}.`);
}

function handlePostAnnouncement() {
  const group = requireOwner();
  if (!group) return;

  const text = el.announcementText.value.trim();
  if (!text) {
    return setMessage(el.editMsg, "Announcement text is empty.");
  }

  group.announcements.unshift({
    text,
    author: group.ownerName,
    role: "owner",
    createdAt: new Date().toISOString()
  });

  persist();
  renderDetail();
  el.announcementText.value = "";
  setMessage(el.editMsg, "Announcement posted.");
}

function unlockOwnerPanel() {
  const entered = el.siteOwnerPassword.value;
  const current = localStorage.getItem(STORAGE_KEYS.siteOwnerPassword) || DEFAULT_SITE_OWNER_PASSWORD;

  if (entered === current) {
    state.ownerPanelUnlocked = true;
    el.ownerPanel.classList.remove("hidden");
    setMessage(el.ownerMsg, "Owner panel unlocked.");
  } else {
    setMessage(el.ownerMsg, "Wrong site owner password.");
  }
}

function addAccessCode() {
  if (!state.ownerPanelUnlocked) {
    return setMessage(el.ownerMsg, "Unlock owner panel first.");
  }

  const code = el.newCodeValue.value.trim();
  const type = el.newCodeType.value;

  if (!code) return setMessage(el.ownerMsg, "Code cannot be empty.");

  if (state.codes.some(item => item.code.toLowerCase() === code.toLowerCase())) {
    return setMessage(el.ownerMsg, "Code already exists.");
  }

  state.codes.push({ code, type, usedByGroupId: null });
  persist();
  renderCodeList();
  el.newCodeValue.value = "";
  setMessage(el.ownerMsg, "Code added.");
}

function joinPublicGroup(groupId) {
  const group = state.groups.find(g => g.id === groupId);
  if (!group) return;

  const name = prompt("Enter your display name to join:");
  if (!name) return;

  const cleanName = name.trim();
  if (!cleanName) return;

  if (group.members.some(m => m.name.toLowerCase() === cleanName.toLowerCase())) {
    alert("You are already in this group.");
    return;
  }

  group.members.push({ name: cleanName, role: "member" });
  persist();
  renderDetail();
}

function renderAll() {
  renderDirectory();
  renderDetail();
  renderCodeList();
}

function renderDirectory() {
  el.directory.innerHTML = "";

  if (state.groups.length === 0) {
    el.directory.innerHTML = "<p class='empty'>No groups yet. Create the first one.</p>";
    return;
  }

  state.groups.forEach(group => {
    const card = document.createElement("button");
    card.className = `group-card ${group.id === state.selectedGroupId ? "active" : ""}`;
    card.type = "button";
    card.innerHTML = `
      <strong>${escapeHTML(group.name)}</strong><br>
      <small>${group.type} • ${group.visibility} • ${group.members.length} members</small>
    `;

    card.addEventListener("click", () => {
      state.selectedGroupId = group.id;
      state.activeTab = "info";
      el.editorPanel.classList.add("hidden");
      renderDirectory();
      renderDetail();
    });

    el.directory.appendChild(card);
  });
}

function renderDetail() {
  const group = getSelectedGroup();

  if (!group) {
    el.emptyState.classList.remove("hidden");
    el.detailView.classList.add("hidden");
    return;
  }

  el.emptyState.classList.add("hidden");
  el.detailView.classList.remove("hidden");

  const created = new Date(group.createdAt);
  el.detailName.textContent = group.name;
  el.detailMeta.textContent = `${group.type.toUpperCase()} • Created ${created.toLocaleDateString()} • Owner: ${group.ownerName}`;

  const isOwner = !!state.ownerSession && state.ownerSession.groupId === group.id;
  el.editBtn.classList.toggle("hidden", !isOwner);
  el.ownerLogoutBtn.classList.toggle("hidden", !isOwner);

  if (!isOwner) {
    el.editorPanel.classList.add("hidden");
  } else {
    el.editName.value = group.name;
    el.editDescription.value = group.description;
    el.editVisibility.value = group.visibility;
  }

  const joinBtn = group.visibility === "public"
    ? `<button class="btn" onclick="joinPublicGroup('${group.id}')">Join Public Group</button>`
    : `<p>This group is invite-only. Ask an admin/owner for access.</p>`;

  el.tabInfo.innerHTML = `
    <p>${escapeHTML(group.description)}</p>
    <p class="meta" style="margin-top: .6rem;">Visibility: ${group.visibility}</p>
    <div style="margin-top: .75rem;">${joinBtn}</div>
  `;

  el.tabMembers.innerHTML = `
    <ul>
      ${group.members.map(m => `<li>${escapeHTML(m.name)} <span class='role-tag'>${m.role}</span></li>`).join("")}
    </ul>
  `;

  el.tabAnnouncements.innerHTML = group.announcements.length
    ? group.announcements.map(item => `
      <div class="feed-item">
        <strong>${escapeHTML(item.author)}</strong> <span class="role-tag">${item.role}</span>
        <p>${escapeHTML(item.text)}</p>
        <small class="meta">${new Date(item.createdAt).toLocaleString()}</small>
      </div>
    `).join("")
    : "<p class='empty'>No announcements yet.</p>";

  renderTabs();
}

function renderTabs() {
  el.tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.tab === state.activeTab));
  el.tabInfo.classList.toggle("hidden", state.activeTab !== "info");
  el.tabMembers.classList.toggle("hidden", state.activeTab !== "members");
  el.tabAnnouncements.classList.toggle("hidden", state.activeTab !== "announcements");
}

function renderCodeList() {
  el.codeList.innerHTML = "";

  state.codes.forEach(item => {
    const li = document.createElement("li");
    const usage = item.usedByGroupId ? "used" : "available";
    li.textContent = `${item.code} — ${item.type} (${usage})`;
    el.codeList.appendChild(li);
  });
}

function requireOwner() {
  const group = getSelectedGroup();
  const isOwner = !!group && state.ownerSession && state.ownerSession.groupId === group.id;

  if (!isOwner) {
    setMessage(el.editMsg, "Owner login required for this action.");
    return null;
  }

  return group;
}

function getSelectedGroup() {
  return state.groups.find(group => group.id === state.selectedGroupId);
}

function findGroupByName(name) {
  return state.groups.find(group => group.name.toLowerCase() === name.toLowerCase());
}

function findCode(code) {
  return state.codes.find(item => item.code.toLowerCase() === code.toLowerCase());
}

function persist() {
  localStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(state.groups));
  localStorage.setItem(STORAGE_KEYS.codes, JSON.stringify(state.codes));
}

function setMessage(element, message) {
  element.textContent = message;
}

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function escapeHTML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

window.joinPublicGroup = joinPublicGroup;

init();
