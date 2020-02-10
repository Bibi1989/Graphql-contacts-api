/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: {
            type: 'uuid',
            unique: true,
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
            comment: "This is the id field"
        },
        username: {
            type: 'VARCHAR(100)',
            nonNull: true,
        },
        email: {
            type: 'VARCHAR(100)',
            unique: true,
        },
        password: {
            type: 'VARCHAR(2000)',
            nonNull: true,
        },
        createdAt: {
            type: 'timestamptz(100)',
            nonNull: true,
            default: pgm.func('current_timestamp')
        },
    })
};

exports.down = pgm => {
    pgm.dropTable('users')
};


