import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Process request
        response = await call_next(request)

        # Calculate execution time
        process_time = round((time.time() - start_time) * 1000, 2)

        # Log request details
        logger.info(
            f"{request.method} {request.url.path} "
            f"- Status: {response.status_code} "
            f"- Duration: {process_time}ms"
        )

        # Add execution time header
        response.headers["X-Process-Time"] = str(process_time)

        return response
