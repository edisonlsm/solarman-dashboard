import type { KVNamespace } from '@cloudflare/workers-types'
import { getEnv } from '../utils/env';

export default defineEventHandler(async (event) => {
  console.log('Hello from server!')

  var env = getEnv();

  console.log(env);



  const keys = await env.KV.get('hello');


  console.log(keys);
  return {
    hello: 'world'
  }
})