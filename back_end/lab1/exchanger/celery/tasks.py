from datetime import datetime
from time import sleep

from celery import shared_task
from django.core.cache import cache
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django_redis import get_redis_connection
import json


@shared_task(bind=True, queue="default")
def send_task(self, name, execution_time):
    task_id = self.request.id
    task_key = f"task_status:{task_id}"

    status_data = {"status": "queued", "name": name, "execution_time": execution_time, "task_id": task_id}
    cache.set(task_key, json.dumps(status_data))

    # ⬅ Додаємо task_id в Redis set
    redis = get_redis_connection("default")
    # print(f"added task {task_id}")
    redis.sadd("task_ids", task_id)

    _notify_ws(status_data)

    try:
        status_data["status"] = "started"
        cache.set(task_key, json.dumps(status_data))
        _notify_ws(status_data)

        sleep(execution_time)

        status_data["status"] = "success"
        status_data["end_time"] = datetime.utcnow().isoformat()
        cache.set(task_key, json.dumps(status_data))
        _notify_ws(status_data)

    except Exception as e:
        status_data["status"] = "error"
        status_data["error"] = str(e)
        cache.set(task_key, json.dumps(status_data))
        _notify_ws(status_data)


def _notify_ws(payload):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "task_status_channel",
        {
            "type": "task_status_update",
            "payload": payload,
        },
    )
