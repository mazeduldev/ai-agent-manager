import Link from "next/link";

export default function Home() {
	return (
		<div>
			<h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
			<Link
				href={"/dashboard"}
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
			>
				Go to Dashboard
			</Link>
		</div>
	);
}
