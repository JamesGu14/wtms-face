'use strict'

const knex = require('../connection.js')

function getAll() {
  return knex('Child').select('*')
}

function getById(id) {
  return knex('Child').select('*')
    .where({ id: parseInt(id) })
}

function add(child) {
  return knex('Child').insert(child)
    .returning('*')
}

function updateById(id, child) {
  return knex('Child').update(child)
    .where({ id: parseInt(id) })
    .returning('*')
}

function deleteById(id) {
  return knex('Child').del()
    .where({ id: parseInt(id) })
    .returning('*')
}

module.exports = {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
}