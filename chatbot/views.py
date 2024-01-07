from rest_framework.views import APIView
from rest_framework.response import Response
import logging
from chatbot.utils.utils import query_chatbot


class ChatbotView(APIView):
    def get(self, request, format=None):
        try:
            ques = request.GET.get("ques", "")
            print(ques)
            answer = query_chatbot(ques)
            print(answer)
            # Your logic here
            return Response(answer)
        except Exception as e:
            # Log the exception and return an error response
            return Response({"status": "error"}, status=500)
