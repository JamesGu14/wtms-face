'use strict'

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('greetingTemplate').del()
    .then(function () {
      // Inserts seed entries
      return knex('greetingTemplate').insert([
        { template: '早上好，{name}，欢迎来到维特牧思儿童之家！' },
        { template: '早上好呀，{name}，真高兴见到你' },
        { template: '上午好，{name}，小维宝贝想你了呢' },
        { template: 'Good morning，{name}，见到你真开心' },
        { template: 'Morning，{name}，记得勤洗小手才能健健康康' },
        { template: '早上好，{name}，你今天看起来很可爱呢' }
      ]);
    });
};
