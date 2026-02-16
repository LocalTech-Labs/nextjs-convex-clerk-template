export const PLANS = {
	free: {
		name: "Free",
		maxProjects: 1,
		maxStorage: 100, // MB
		maxTeamMembers: 1,
	},
	pro: {
		name: "Pro",
		maxProjects: 50,
		maxStorage: 10_000, // MB
		maxTeamMembers: 10,
	},
} as const;

export const PLAN_FEATURES = [
	{
		name: "Projects",
		free: `${PLANS.free.maxProjects} project`,
		pro: `Up to ${PLANS.pro.maxProjects} projects`,
	},
	{
		name: "Storage",
		free: `${PLANS.free.maxStorage} MB`,
		pro: `${PLANS.pro.maxStorage / 1000} GB`,
	},
	{
		name: "Team members",
		free: `${PLANS.free.maxTeamMembers} member`,
		pro: `Up to ${PLANS.pro.maxTeamMembers} members`,
	},
	{
		name: "Priority support",
		free: "No",
		pro: "Yes",
	},
	{
		name: "Analytics",
		free: "Basic",
		pro: "Advanced",
	},
	{
		name: "Custom domain",
		free: "No",
		pro: "Yes",
	},
] as const;
