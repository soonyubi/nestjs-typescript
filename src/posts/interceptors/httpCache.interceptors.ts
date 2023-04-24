import { CacheInterceptor, ExecutionContext, Injectable } from "@nestjs/common";
import { CACHE_KEY_METADATA } from "@nestjs/common/cache/cache.constants";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor{
    trackBy(context: ExecutionContext): string | undefined {
        
        const cacheKey=  this.reflector.get(
            CACHE_KEY_METADATA,
            context.getHandler()
        );
        
        if(cacheKey){
            const request = context.switchToHttp().getRequest();
            // console.log(request);
            // console.log(request._parsedUrl);
            // console.log(request._parsedUrl.query);
            
            return `${cacheKey}-${request._parsedUrl.query}`;
        }

        return super.trackBy(context);
    }
    
}