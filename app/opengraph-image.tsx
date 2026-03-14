import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/config";

export const runtime = "edge";

export const alt = `${APP_NAME} - Launch Your SaaS Fast`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
	return new ImageResponse(
		<div
			style={{
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				fontFamily: "system-ui, sans-serif",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: "24px",
				}}
			>
				<div
					style={{
						fontSize: "72px",
						fontWeight: 800,
						color: "white",
						letterSpacing: "-2px",
					}}
				>
					{APP_NAME}
				</div>
				<div
					style={{
						fontSize: "32px",
						color: "#94a3b8",
						maxWidth: "600px",
						textAlign: "center",
					}}
				>
					Launch Your SaaS Fast
				</div>
				<div
					style={{
						display: "flex",
						gap: "12px",
						marginTop: "16px",
					}}
				>
					{["Next.js", "Convex", "Clerk"].map((tech) => (
						<div
							key={tech}
							style={{
								padding: "8px 20px",
								borderRadius: "9999px",
								border: "1px solid #334155",
								color: "#cbd5e1",
								fontSize: "18px",
							}}
						>
							{tech}
						</div>
					))}
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
