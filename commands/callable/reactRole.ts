import { Message } from "discord.js";
import { addReactionRole, guildReactions } from "../../src/setup_table";
import RoleBot from "../../src/bot";

export default {
  desc: "Create a message with reactions that toggle role assignment",
  name: "reactRole",
  args: "Follow the prompts",
  run: async (message: Message, _args: string[], client: RoleBot) => {
    if (!message.member.hasPermission(["MANAGE_ROLES_OR_PERMISSIONS"])) return;

    const GUILD_ID = message.guild.id;
    const channel = message.channel;
    let id: string = "";

    /* Let me clarify I am disgusted with the code below */

    channel
      .send("Enter the role name. If you want to stop type say cancel")
      .then(bm => {
        // Because I'm fighting callbacks and I'm stupid
        const emojiId = (i: string) => (id = i);

        channel
          .awaitMessages(m => m.author.id === message.author.id, {
            max: 1,
            time: 60000,
            errors: ["time"]
          })
          .then(m => {
            // Might as well cancel the whole process if they don't wanna do this
            if (m.first().content.toLocaleLowerCase() === "cancel") return;

            const GUILD_REACT = guildReactions(message.guild.id);

            const role = message.guild.roles.find(
              r =>
                r.name.toLocaleLowerCase() ===
                m.first().content.toLocaleLowerCase()
            );

            if (
              role &&
              bm instanceof Message &&
              GUILD_REACT.find(r => r.role_id === role.id)
            ) {
              bm.edit(`Emoji already exist for this role`);
              m.first().delete();
              return;
            }

            if (role && bm instanceof Message) {
              // They got the role they wanted. Now we need to get the emoji
              bm.edit(
                "Now send the emoji to match the role. This must be local to the server or a generic Discord emoji."
              );
              m.first().delete();

              channel
                .awaitMessages(m => m.author.id === message.author.id, {
                  max: 1,
                  time: 20000,
                  errors: ["time"]
                })
                .then(m => {
                  // Some discord emojis don't have id's and just use the unicode. Weird
                  const match = /<:\w+:(\d+)>/.exec(m.first().content);
                  if (match) {
                    const [, id] = match;
                    emojiId(id);
                  } else if (
                    client.emojis.find(e => e.name === m.first().content)
                  ) {
                    emojiId(m.first().content);
                  } else {
                    if (bm instanceof Message) {
                      bm.edit(
                        `Either not an emoji or it's not available to me. :(`
                      );
                      m.first().delete();
                      return;
                    }
                  }

                  if (role && id !== "") {
                    // Assuming everything went uh, great. Try to add. :))
                    addReactionRole(id, role.id, role.name, GUILD_ID);
                    if (bm instanceof Message) {
                      m.first().delete();
                      bm.edit(
                        "Assuming everything went as planned, get the list!"
                      );
                    }
                  }
                })
                .catch(() => {
                  if (bm instanceof Message) bm.edit("No usable emoji given.");
                });
            }
          })
          .catch(() => {
            if (bm instanceof Message) bm.edit("You didn't send role name.");
          });
      });
  }
};