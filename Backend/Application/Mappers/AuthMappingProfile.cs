namespace Application.Mappers;

using System;
using AutoMapper;
using Application.Dtos;
using Domain.Entities;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        CreateMap<UserRegisterDto, User>(MemberList.Source)
            .ForMember(dest => dest.RegisteredAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
    }
}