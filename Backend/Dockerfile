FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore "BoardGamesTracker.sln"

RUN dotnet publish "BoardGamesTrackerApi/BoardGamesTrackerApi/BoardGamesTrackerApi.csproj" \
    -c Release -o /app/publish/api --no-restore

RUN dotnet publish "BoardGameTrackerAuthorizeApi/BoardGameTrackerAuthorizeApi.csproj" \
    -c Release -o /app/publish/authorize --no-restore

RUN dotnet publish "BoardGameTrackerNotificationService/BoardGameTrackerNotificationService.csproj" \
    -c Release -o /app/publish/notification --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app/publish/api ./api
COPY --from=build /app/publish/authorize ./authorize
COPY --from=build /app/publish/notification ./notification

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"