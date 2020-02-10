/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('contacts', {
        id: {
            type: 'uuid',
            unique: true,
            primaryKey: true,
            default: pgm.func('uuid_generate_v4()'),
            comment: "This is the id field"
        },
        first_name: {
            type: 'VARCHAR(1000)',
            nonNull: true,
        },
        owner_id: {
            type: 'uuid',
            nonNull: true
        },
        last_name: {
            type: 'VARCHAR(1000)',
            nonNull: true,
        },
        phone: {
            type: 'VARCHAR(200)',
            nonNull: true,
        },
        email: {
            type: 'VARCHAR(1000)'
        },
        company: {
            type: 'VARCHAR(1000)',
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
    pgm.dropTable('contacts')
};


