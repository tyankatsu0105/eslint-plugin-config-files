"use strict";

module.exports = {
  publishCommand: ({ defaultCommand }) => `${defaultCommand} --access public`,
  afterPublish({ exec }) {
    exec("git config --global user.email frips.ryilsufupe+dev@gmail.com");
    exec("git config --global user.name tyankatsu");

    exec("git checkout master");
    exec("git merge develop");
    exec("git push origin master");
  },
};
