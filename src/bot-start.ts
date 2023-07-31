import RB from "./bot";

const RoleBot = new RB();

RoleBot.start().catch((e) => RoleBot.log.error(`Role Minion has encounter an error while starting up. ${e}`));

export default RoleBot;
