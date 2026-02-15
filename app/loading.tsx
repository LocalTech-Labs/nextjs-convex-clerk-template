import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
			<Skeleton className="h-8 w-64" />
			<Skeleton className="h-4 w-48" />
			<Skeleton className="h-4 w-32" />
		</div>
	);
}
