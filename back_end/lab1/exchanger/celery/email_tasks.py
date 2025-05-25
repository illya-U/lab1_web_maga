from celery import shared_task
from django.core.cache import cache
from django.core.mail import send_mail
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django_redis import get_redis_connection
import json

@shared_task(bind=True, queue='email_queue')
def send_registration_email(self, user_email, username):
    task_id = self.request.id
    task_key = f"email_task_status:{task_id}"

    status_data = {"status": "queued", "email": user_email, "task_id": task_id}
    cache.set(task_key, json.dumps(status_data))

    # ⬅ Додаємо task_id в Redis set
    redis = get_redis_connection("default")
    # print(f"added task {task_id}")
    redis.sadd("email_task_ids", task_id)

    _notify_ws(status_data)

    try:
        status_data["status"] = "started"
        cache.set(task_key, json.dumps(status_data))
        _notify_ws(status_data)

        send_mail(
            subject="Welcome to Exchanger 🎉",
            message=f"Привіт, {username}! Дякуємо за реєстрацію.",
            from_email=None,
            recipient_list=[user_email],
            fail_silently=False,
        )

        status_data["status"] = "success"
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
        "email_status_channel",
        {
            "type": "email_status_update",
            "payload": payload,
        }
    )
