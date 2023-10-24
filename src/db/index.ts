import { PrismaClient } from "@prisma/client";

function getPrismaClient() {
	if (process.env.NODE_ENV === "development") {
		const client = new PrismaClient({
			log: [
				{
					level: "query",
					emit: "event",
				},
				{
					level: "info",
					emit: "event",
				},
				{
					level: "warn",
					emit: "event",
				},
				{
					level: "error",
					emit: "event",
				},
			],
		});

		return client;
	}

	return new PrismaClient();
}

const db = getPrismaClient();

export default db;
