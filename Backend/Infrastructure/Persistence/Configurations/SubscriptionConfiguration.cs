using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        builder.HasKey(s => s.Id);

        builder.HasIndex(s => new { s.FollowerId, s.FollowingId }).IsUnique();

        builder.HasOne(s => s.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(s => s.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(s => s.Following)
            .WithMany(u => u.Followers)
            .HasForeignKey(s => s.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
