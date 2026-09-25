FROM python:3.11-slim

WORKDIR /app

# Copy dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app files
COPY . .

EXPOSE 3308

# Use FLASK_ENV to determine whether to run in debug mode
CMD ["flask", "run", "--host=0.0.0.0", "--port=3308"]
