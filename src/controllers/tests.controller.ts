import httpStatus from "http-status";
import { Request, Response } from "express";
import DB from "../db/index"
const User = DB.User;

export const testGet = async (req: Request, res: Response) => {
	const users = await User.findAll();
	return res.status(httpStatus.OK).json({ message: "User created successfully", data: users });
}



export const testPost = async (req: Request, res: Response) => {
	const user = await User.create({ ...req.body });
	return res.status(httpStatus.OK).json({ message: "User created successfully", data: user });
}
