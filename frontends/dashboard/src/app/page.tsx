import Link from "next/link";
import { Bot, Rocket, TrendingUp } from "lucide-react";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
			<main className="max-w-4xl mx-auto">
				<h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
					The Command Center for Your AI Workforce
				</h1>
				<p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
					Stop juggling disparate tools. Verbex provides a seamless platform to
					build, monitor, and scale your AI agents, bringing all your AI
					operations under one roof.
				</p>

				<div className="mt-12 flex flex-col md:flex-row gap-8 justify-center">
					<div className="flex flex-col items-center">
						<Bot className="h-10 w-10 text-blue-600" />
						<h3 className="mt-4 text-lg font-semibold text-gray-800">
							Build Agents Intuitively
						</h3>
						<p className="mt-1 text-gray-500">
							Use our powerful editor to create and configure agents with ease.
						</p>
					</div>
					<div className="flex flex-col items-center">
						<TrendingUp className="h-10 w-10 text-blue-600" />
						<h3 className="mt-4 text-lg font-semibold text-gray-800">
							Monitor Performance
						</h3>
						<p className="mt-1 text-gray-500">
							Gain real-time insights into conversations and agent
							effectiveness.
						</p>
					</div>
					<div className="flex flex-col items-center">
						<Rocket className="h-10 w-10 text-blue-600" />
						<h3 className="mt-4 text-lg font-semibold text-gray-800">
							Deploy & Scale
						</h3>
						<p className="mt-1 text-gray-500">
							Seamlessly deploy your agents and scale your operations on demand.
						</p>
					</div>
				</div>

				<div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link
						href={"/auth/signup"} // Assuming a signup route
						className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors text-lg"
					>
						Get Started for Free
					</Link>
					<Link
						href={"/auth/login"} // Assuming a login route
						className="w-full sm:w-auto px-8 py-3 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition-colors text-lg"
					>
						Sign In
					</Link>
				</div>
			</main>
		</div>
	);
}
