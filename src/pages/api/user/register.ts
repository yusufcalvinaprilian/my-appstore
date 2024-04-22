import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/lib/firebase/service";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		console.log(req.method);
		await signUp(req.body, (status: boolean) => {
			console.log(status);
			console.log(req.body);
			if (status) {
				res.status(200).json({ success: true, message: "success" });
				console.log(status);
			} else {
				res.status(400).json({ status: false, statuscode: 400, message: "User already exists" });
				console.log(status);
			}
		});
	} else {
		res.status(405).json({ status: false, statuscode: 405, message: "Method not allowed" });
	}
}
