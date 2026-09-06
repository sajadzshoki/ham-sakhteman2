import type {
  Announcement,
  AnnouncementImportance,
  AuthUser,
  Building,
  BuildingMember,
  BuildingUnit,
  Invitation,
  MemberRole,
  ProblemCategory,
  ProblemReport,
  ProblemStatus,
  UnitStatus,
} from '~/types'
import {
  DEMO_MANAGER_ID,
  DEMO_RESIDENT_ID,
  seedAnnouncements,
  seedBuildings,
  seedInvitations,
  seedMembers,
  seedProblems,
  seedUnits,
} from '~/data/seed'

/**
 * استور دامنه (ساختمان/واحدها/اعضا/دعوت‌نامه‌ها) با ذخیره‌سازی در کوکی.
 * کوکی‌ها در SSR هم قابل خواندن‌اند تا رندر سرور و کلاینت هم‌خوان بمانند.
 * در فاز بک‌اند واقعی، این لایه با فراخوانی API جایگزین می‌شود.
 */
export function useAppStore() {
  const refs = useStoreRefs()
  const buildings = refs.buildings
  const units = refs.units
  const members = refs.members
  const invitations = refs.invitations
  const announcements = refs.announcements
  const problems = refs.problems
  const seeded = refs.seeded

  // ——— بذرپاشی دیتای دمو ———

  function ensureSeeded() {
    if (seeded.value) return

    const demoUsers: AuthUser[] = [
      {
        id: DEMO_MANAGER_ID,
        name: 'رضا احمدی',
        phone: '09121112233',
        role: 'manager',
        password: '1234',
        createdAt: daysAgo(200).toISOString(),
      },
      {
        id: DEMO_RESIDENT_ID,
        name: 'سارا محمدی',
        phone: '09123456789',
        role: 'resident',
        password: '1234',
        createdAt: daysAgo(200).toISOString(),
      },
    ]

    refs.users.value = [...demoUsers, ...refs.users.value]

    buildings.value = [...seedBuildings]
    units.value = [...seedUnits]
    members.value = [...seedMembers]
    invitations.value = [...seedInvitations]
    announcements.value = [...seedAnnouncements]
    problems.value = [...seedProblems]
    seeded.value = true
  }

  // ——— کوئری‌ها ———

  function membershipOfUser(user: AuthUser | null): BuildingMember | null {
    if (!user) return null
    return members.value.find(member => member.userId === user.id) ?? null
  }

  function buildingOfUser(user: AuthUser | null): Building | null {
    const membership = membershipOfUser(user)
    if (!membership) return null
    return buildings.value.find(building => building.id === membership.buildingId) ?? null
  }

  const buildingById = (id: string) => buildings.value.find(building => building.id === id) ?? null

  const buildingUnits = (buildingId: string) =>
    units.value
      .filter(unit => unit.buildingId === buildingId)
      .sort((a, b) => a.number - b.number)

  const buildingMembers = (buildingId: string) =>
    members.value.filter(member => member.buildingId === buildingId)

  const buildingManager = (buildingId: string) =>
    members.value.find(member => member.buildingId === buildingId && member.role === 'manager') ?? null

  const memberOfUnit = (unitId: string) =>
    members.value.find(member => member.unitId === unitId) ?? null

  const residentCount = (buildingId: string) =>
    members.value.filter(member => member.buildingId === buildingId && member.role === 'resident').length

  const floorCount = (buildingId: string) =>
    buildingUnits(buildingId).reduce((max, unit) => Math.max(max, unit.floor), 0)

  // ——— ساختمان ———

  function createBuilding(
    input: { name: string; address: string; unitsCount: number; description?: string },
    manager: AuthUser,
  ): Building {
    const building: Building = {
      id: createId('b'),
      name: input.name.trim(),
      address: input.address.trim(),
      unitsCount: input.unitsCount,
      description: input.description?.trim() || undefined,
      managerId: manager.id,
      createdAt: new Date().toISOString(),
    }
    buildings.value = [...buildings.value, building]

    // تولید خودکار واحدها: هر طبقه ۲ واحد
    const generated: BuildingUnit[] = Array.from({ length: input.unitsCount }, (_, index) => ({
      id: createId('u'),
      buildingId: building.id,
      number: index + 1,
      floor: Math.floor(index / 2) + 1,
    }))
    units.value = [...units.value, ...generated]

    const managerMember: BuildingMember = {
      id: createId('m'),
      buildingId: building.id,
      userId: manager.id,
      name: manager.name,
      phone: manager.phone,
      role: 'manager',
      joinedAt: new Date().toISOString(),
    }
    members.value = [...members.value, managerMember]

    return building
  }

  function updateBuilding(id: string, patch: Partial<Pick<Building, 'name' | 'address' | 'unitsCount' | 'description'>>) {
    buildings.value = buildings.value.map(building =>
      building.id === id ? { ...building, ...patch } : building,
    )
  }

  // ——— واحدها ———

  function addUnit(buildingId: string, input: { number: number; floor: number }): BuildingUnit {
    const unit: BuildingUnit = { id: createId('u'), buildingId, number: input.number, floor: input.floor }
    units.value = [...units.value, unit]
    const building = buildingById(buildingId)
    if (building && buildingUnits(buildingId).length > building.unitsCount) {
      updateBuilding(buildingId, { unitsCount: buildingUnits(buildingId).length })
    }
    return unit
  }

  function updateUnit(id: string, patch: Partial<Pick<BuildingUnit, 'number' | 'floor'>>) {
    units.value = units.value.map(unit => (unit.id === id ? { ...unit, ...patch } : unit))
  }

  function removeUnit(id: string) {
    units.value = units.value.filter(unit => unit.id !== id)
    // آزادسازی اعضای تخصیص‌یافته به واحد حذف‌شده
    members.value = members.value.map(member =>
      member.unitId === id ? { ...member, unitId: undefined, unitStatus: undefined } : member,
    )
  }

  // ——— اعضا ———

  function addMember(buildingId: string, input: {
    name: string
    phone?: string
    role: MemberRole
    unitId?: string
    unitStatus?: UnitStatus
  }): BuildingMember {
    if (input.unitId) {
      // هر واحد فقط یک عضو اصلی دارد
      members.value = members.value.map(member =>
        member.unitId === input.unitId ? { ...member, unitId: undefined, unitStatus: undefined } : member,
      )
    }
    const member: BuildingMember = {
      id: createId('m'),
      buildingId,
      name: input.name.trim(),
      phone: input.phone?.trim() || undefined,
      role: input.role,
      unitId: input.unitId || undefined,
      unitStatus: input.unitId ? (input.unitStatus ?? 'owner') : undefined,
      joinedAt: new Date().toISOString(),
    }
    members.value = [...members.value, member]
    return member
  }

  function removeMember(id: string) {
    members.value = members.value.filter(member => member.id !== id)
  }

  function assignMemberToUnit(memberId: string, unitId: string | null, unitStatus?: UnitStatus) {
    members.value = members.value.map((member) => {
      if (member.id === memberId) {
        return unitId
          ? { ...member, unitId, unitStatus: unitStatus ?? 'owner' }
          : { ...member, unitId: undefined, unitStatus: undefined }
      }
      // واحد را از عضو قبلی جدا کن
      if (unitId && member.unitId === unitId) {
        return { ...member, unitId: undefined, unitStatus: undefined }
      }
      return member
    })
  }

  // ——— دعوت‌نامه‌ها ———

  function createInvitation(buildingId: string, role: MemberRole, creatorId: string): Invitation {
    const invitation: Invitation = {
      id: createId('inv'),
      buildingId,
      code: generateInviteCode(),
      role,
      createdBy: creatorId,
      createdAt: new Date().toISOString(),
      expiresAt: daysAhead(365).toISOString(),
      status: 'active',
    }
    invitations.value = [invitation, ...invitations.value]
    return invitation
  }

  function removeInvitation(id: string) {
    invitations.value = invitations.value.filter(invitation => invitation.id !== id)
  }

  const buildingInvitations = (buildingId: string) =>
    invitations.value
      .filter(invitation => invitation.buildingId === buildingId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  function findInvitation(code: string): Invitation | null {
    const normalized = code.trim().toUpperCase()
    return invitations.value.find(invitation => invitation.code === normalized) ?? null
  }

  /** وضعیت نمایشی دعوت‌نامه با درنظرگرفتن انقضا */
  function invitationDisplayStatus(invitation: Invitation): Invitation['status'] {
    if (invitation.status === 'active' && new Date(invitation.expiresAt).getTime() < Date.now()) {
      return 'expired'
    }
    return invitation.status
  }

  /** پیوستن کاربر به ساختمان با کد دعوت */
  function joinWithInvitation(code: string, user: AuthUser): { ok: true; building: Building } | { ok: false; error: 'invalid' | 'used' | 'expired' | 'duplicate' } {
    const invitation = findInvitation(code)
    if (!invitation || invitation.status !== 'active') return { ok: false, error: 'invalid' }
    if (invitationDisplayStatus(invitation) === 'expired') return { ok: false, error: 'expired' }
    const building = buildingById(invitation.buildingId)
    if (!building) return { ok: false, error: 'invalid' }
    if (membershipOfUser(user)) return { ok: false, error: 'duplicate' }

    const member: BuildingMember = {
      id: createId('m'),
      buildingId: building.id,
      userId: user.id,
      name: user.name,
      phone: user.phone,
      role: invitation.role,
      joinedAt: new Date().toISOString(),
    }
    members.value = [...members.value, member]
    invitations.value = invitations.value.map(item =>
      item.id === invitation.id ? { ...item, status: 'used' as const } : item,
    )
    return { ok: true, building }
  }

  // ——— اطلاعیه‌ها ———

  const sortByNewest = <T extends { createdAt: string }>(items: T[]) =>
    [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const buildingAnnouncements = (buildingId: string) =>
    sortByNewest(announcements.value.filter(item => item.buildingId === buildingId))

  const getAnnouncement = (id: string) =>
    announcements.value.find(item => item.id === id) ?? null

  function createAnnouncement(
    buildingId: string,
    input: { title: string; body: string; importance: AnnouncementImportance; image?: string },
    author: { id: string; name: string },
  ): Announcement {
    const announcement: Announcement = {
      id: createId('ann'),
      buildingId,
      title: input.title.trim(),
      body: input.body.trim(),
      importance: input.importance,
      image: input.image || undefined,
      createdBy: author.id,
      createdByName: author.name,
      createdAt: new Date().toISOString(),
    }
    announcements.value = [announcement, ...announcements.value]
    return announcement
  }

  function updateAnnouncement(
    id: string,
    patch: Partial<Pick<Announcement, 'title' | 'body' | 'importance' | 'image'>>,
  ) {
    announcements.value = announcements.value.map((item) => {
      if (item.id !== id) return item
      const next = { ...item, ...patch, updatedAt: new Date().toISOString() }
      if (!next.image) delete next.image
      return next
    })
  }

  function removeAnnouncement(id: string) {
    announcements.value = announcements.value.filter(item => item.id !== id)
  }

  // ——— گزارش مشکلات ———

  const buildingProblems = (buildingId: string) =>
    sortByNewest(problems.value.filter(item => item.buildingId === buildingId))

  const problemsOfUser = (buildingId: string, userId: string) =>
    buildingProblems(buildingId).filter(item => item.reportedBy === userId)

  const openBuildingProblems = (buildingId: string) =>
    buildingProblems(buildingId).filter(item => item.status !== 'resolved')

  const getProblem = (id: string) =>
    problems.value.find(item => item.id === id) ?? null

  function createProblemReport(
    buildingId: string,
    input: { category: ProblemCategory; title: string; description: string; image?: string },
    reporter: { id: string; name: string },
  ): ProblemReport {
    const report: ProblemReport = {
      id: createId('pr'),
      buildingId,
      category: input.category,
      title: input.title.trim(),
      description: input.description.trim(),
      image: input.image || undefined,
      status: 'new',
      reportedBy: reporter.id,
      reportedByName: reporter.name,
      createdAt: new Date().toISOString(),
    }
    problems.value = [report, ...problems.value]
    return report
  }

  function updateProblemStatus(id: string, status: ProblemStatus) {
    problems.value = problems.value.map((item) => {
      if (item.id !== id) return item
      return { ...item, status, updatedAt: new Date().toISOString() }
    })
  }

  function removeProblem(id: string) {
    problems.value = problems.value.filter(item => item.id !== id)
  }

  return {
    buildings,
    units,
    members,
    invitations,
    announcements,
    problems,
    ensureSeeded,
    membershipOfUser,
    buildingOfUser,
    buildingById,
    buildingUnits,
    buildingMembers,
    buildingManager,
    memberOfUnit,
    residentCount,
    floorCount,
    createBuilding,
    updateBuilding,
    addUnit,
    updateUnit,
    removeUnit,
    addMember,
    removeMember,
    assignMemberToUnit,
    createInvitation,
    removeInvitation,
    buildingInvitations,
    findInvitation,
    invitationDisplayStatus,
    joinWithInvitation,
    buildingAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    removeAnnouncement,
    buildingProblems,
    problemsOfUser,
    openBuildingProblems,
    getProblem,
    createProblemReport,
    updateProblemStatus,
    removeProblem,
  }
}
