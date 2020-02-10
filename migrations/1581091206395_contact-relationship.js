/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createConstraint("contacts", "contact_owner_id_fkey", {
    foreignKeys: {
      columns: "owner_id",
      references: 'users("id")'
    }
  });
};

exports.down = pgm => {
  pgm.dropConstraint("contacts", "contact_owner_id_fkey");
};