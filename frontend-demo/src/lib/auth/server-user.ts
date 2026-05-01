import { User } from '@/features/auth/types';
import 'server-only'
import { getAccessTokenCookie } from './cookies';
import createLaravelApi from '../http/laravel';
import axios from 'axios';


export async function getServerUser():Promise<User | null> {
    const token = await getAccessTokenCookie()

    if(!token){
        return null
    }
    try{
        const laravel = createLaravelApi(token)
        const response = await laravel.get('me');

        return response.data?.data ?? response.data?.user ?? response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('[getServerUser] axios error status:', error.response?.status);
      console.log('[getServerUser] axios error data:', error.response?.data);
    } else {
      console.log('[getServerUser] unknown error:', error);
    }

    return null;
  }
}
