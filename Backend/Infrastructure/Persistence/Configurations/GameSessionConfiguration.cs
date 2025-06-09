using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GameSessionConfiguration : IEntityTypeConfiguration<GameSession>
{
    public void Configure(EntityTypeBuilder<GameSession> builder)
    {
        builder.HasKey(gs => gs.Id);

        builder.HasOne(gs => gs.Game)
            .WithMany(g => g.GameSessions)
            .HasForeignKey(gs => gs.GameId)
            .OnDelete(DeleteBehavior.Restrict);


        builder.HasOne(gs => gs.CreatedBy)
            .WithMany(u => u.GameSessions)
            .HasForeignKey(gs => gs.CreatedById)
            .OnDelete(DeleteBehavior.Restrict);


        builder.HasMany(gs => gs.Results)
            .WithOne(r => r.GameSession)
            .HasForeignKey(r => r.GameSessionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}