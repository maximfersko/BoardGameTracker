using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class CollectionItemConfiguration : IEntityTypeConfiguration<CollectionItem>
{
    public void Configure(EntityTypeBuilder<CollectionItem> builder)
    {
        builder.HasKey(i => i.Id);

        builder.HasIndex(i => new { i.CollectionId, i.GameId }).IsUnique();

        builder.HasOne(i => i.Collection)
            .WithMany(c => c.Items)
            .HasForeignKey(i => i.CollectionId);

        builder.HasOne(i => i.Game)
            .WithMany(g => g.CollectionItems)
            .HasForeignKey(i => i.GameId);
    }
}