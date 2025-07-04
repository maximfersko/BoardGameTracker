
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface RegisterFormData {
  email: string;
  displayName: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Регистрация пользователя:', {
        email: data.email,
        displayName: data.displayName,
        registeredAt: new Date()
      });
      
      toast.success("Регистрация успешна!");
      navigate('/login');
    } catch (error) {
      toast.error("Ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Регистрация</h2>
          <p className="mt-2 text-sm text-gray-600">
            Создайте аккаунт для доступа к базе настольных игр
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Новый аккаунт</CardTitle>
            <CardDescription>
              Заполните все поля для создания аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email обязателен",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Некорректный email"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your@email.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayName"
                  rules={{
                    required: "Имя пользователя обязательно",
                    minLength: {
                      value: 2,
                      message: "Минимум 2 символа"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Имя пользователя</FormLabel>
                      <FormControl>
                        <Input 
                          type="text" 
                          placeholder="Ваше имя" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Пароль обязателен",
                    minLength: {
                      value: 6,
                      message: "Минимум 6 символов"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Введите пароль" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: "Подтверждение пароля обязательно"
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Подтвердите пароль</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Повторите пароль" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Уже есть аккаунт?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Войти
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
