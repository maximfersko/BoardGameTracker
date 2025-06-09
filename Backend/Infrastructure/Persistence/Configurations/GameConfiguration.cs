using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GameConfiguration : IEntityTypeConfiguration<Game>
{
    public void Configure(EntityTypeBuilder<Game> builder)
    {
        builder.HasKey(g => g.Id);

        builder.HasIndex(g => g.Alias).IsUnique();

        builder.Property(g => g.TitleRu).IsRequired();
        builder.Property(g => g.TitleEn).IsRequired();

        builder.HasMany(g => g.CollectionItems)
            .WithOne(ci => ci.Game)
            .HasForeignKey(ci => ci.GameId);

        builder.HasMany(g => g.GameSessions)
            .WithOne(gs => gs.Game)
            .HasForeignKey(gs => gs.GameId);
    }
}