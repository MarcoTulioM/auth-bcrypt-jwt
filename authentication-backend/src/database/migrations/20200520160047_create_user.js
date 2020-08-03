
exports.up = function(knex) {
  return knex.schema.createTable('users', function (table) {
      table.string('name').notNullable();
      table.string('password').notNullable();
      table.string('refreshToken');
  });
};

exports.down = function(knex) {
return knex.schema.dropTable('users');
};