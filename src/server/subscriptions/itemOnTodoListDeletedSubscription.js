// @flow

import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLID,
} from 'graphql'
import { withFilter } from 'graphql-subscriptions'

import pubsub from './pubsub'
import { TODO_ITEM_DELETED } from './consts'

import todoItemType from '../types/todoItemType'
import todoListType from '../types/todoListType'

import { getTodoListFromTodoItem } from '../data'

const itemOnTodoListDeletedSubscription = {
  type: new GraphQLObjectType({
    name: 'ItemOnTodoListDeleted',
    fields: {
      todoItem: {
        type: new GraphQLNonNull(todoItemType),
        resolve: payload => payload.todoItem,
      },
      todoList: {
        type: new GraphQLNonNull(todoListType),
        resolve: async payload => await getTodoListFromTodoItem(payload.todoItem),
      },
    },
  }),
  args: {
    todoListID: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  subscribe: withFilter(
    () => pubsub.asyncIterator(TODO_ITEM_DELETED),
    (payload, args) => payload.todoListID === args.todoListID,
  ),
  resolve: (payload: mixed) => payload,
}

export default itemOnTodoListDeletedSubscription