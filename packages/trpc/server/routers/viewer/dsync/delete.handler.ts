import jackson from "@calcom/features/ee/sso/lib/jackson";
import { canAccess } from "@calcom/features/ee/sso/lib/saml";

import { TRPCError } from "@trpc/server";

import type { TrpcSessionUser } from "../../../trpc";
import type { ZDeleteInputSchema } from "./delete.schema";

type Options = {
  ctx: {
    user: NonNullable<TrpcSessionUser>;
  };
  input: ZDeleteInputSchema;
};

// Delete directory sync connection for a team
export const deleteHandler = async ({ ctx, input }: Options) => {
  const { dsyncController } = await jackson();

  const { message, access } = await canAccess(ctx.user, input.teamId);

  if (!access) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message,
    });
  }

  await dsyncController.directories.delete(input.directoryId);

  return null;
};