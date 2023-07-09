import httpStatus from "http-status";
import { Request, Response } from "express";

export const testv1 = async (req: Request, res: Response) => {
	res.status(httpStatus.OK).send("TEST COMPLETED!")
}
