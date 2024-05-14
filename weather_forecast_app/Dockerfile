FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-11-jdk \
    && apt-get clean

RUN mkdir -p /usr/local/android-sdk/cmdline-tools
RUN curl -o commandlinetools.zip https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip
RUN unzip commandlinetools.zip -d /usr/local/android-sdk/cmdline-tools
RUN rm commandlinetools.zip

RUN mkdir -p /usr/local/android-sdk/cmdline-tools/latest \
    && mv /usr/local/android-sdk/cmdline-tools/cmdline-tools/* /usr/local/android-sdk/cmdline-tools/latest

ENV ANDROID_SDK_ROOT=/usr/local/android-sdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

RUN yes | sdkmanager --licenses
RUN sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"

RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter
ENV PATH=$PATH:/usr/local/flutter/bin

RUN flutter doctor

RUN flutter config --enable-web

RUN yes | flutter doctor --android-licenses

WORKDIR /app

COPY . /app

RUN flutter pub get

CMD ["flutter", "build", "apk"]
