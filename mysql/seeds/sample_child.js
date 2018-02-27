
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('child').del()
    .then(function () {
      // Inserts seed entries
      return knex('child').insert([
        { fullName: '甘祖昌', uid: 'gujiasheng' },
        { fullName: '高圆圆', uid: 'chengkuo' },
      ]);
    });
};
