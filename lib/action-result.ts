export type ActionResult = {
  ok: boolean;
  message: string;
};

export const emptyActionResult: ActionResult = {
  ok: false,
  message: "",
};
