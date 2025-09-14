"use client";
import { useEffect, useState } from "react";

const Dashboard = () => {
	const [user, setUser] = useState<{ id: number; email: string }>();
	useEffect(() => {
		// fetch current user info
		fetch("/authServer/users/me")
			.then((res) => {
				if (!res.ok) {
					throw new Error("Failed to fetch user info");
				}
				return res.json();
			})
			.then((data) => {
				console.log("Current user:", data);
				setUser(data);
			})
			.catch((error) => {
				console.error("Error fetching user info:", error);
			});
	}, []);

	return (
		<div>
			<p>Dashboard: Agents list</p>
			{user && <p>Welcome, {user.email}</p>}
		</div>
	);
};

export default Dashboard;
