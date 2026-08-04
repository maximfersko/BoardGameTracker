FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore "BoardGamesTracker.sln"

RUN dotnet publish "BoardGamesTrackerApi/BoardGamesTrackerApi/BoardGamesTrackerApi.csproj" \
    -c Release -o /app/publish/api --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
RUN mkdir -p /app/data

COPY --from=build /app/publish/api ./api

ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_CONTENTROOT=/app/api
EXPOSE 80
ENTRYPOINT ["dotnet", "api/BoardGamesTrackerApi.dll"]
