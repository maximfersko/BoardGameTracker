using System.Linq;

namespace Application;

public static class DefaultCollections
{
    public static readonly string[] Names =
    {
        "Моя коллекция",
        "Играл",
        "Хочу сыграть",
        "Хочу купить",
        "Продаю"
    };

    public static bool IsDefault(string name) => Names.Contains(name);
}
