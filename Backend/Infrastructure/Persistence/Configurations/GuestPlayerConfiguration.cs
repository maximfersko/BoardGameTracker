using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GuestPlayerConfiguration : IEntityTypeConfiguration<GuestPlayer>
{
    public void Configure(EntityTypeBuilder<GuestPlayer> builder)
    {
        builder.HasKey(g => g.Id);

        builder.Property(g => g.Name).IsRequired();

        builder.HasOne(g => g.User)
            .WithMany()
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(g => new { g.UserId, g.Name }).IsUnique();
    }
}
