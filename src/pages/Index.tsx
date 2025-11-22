import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  size: '25см' | '30см' | '35см';
}

interface CartItem extends Pizza {
  quantity: number;
}

const pizzas: Pizza[] = [
  {
    id: 1,
    name: 'Маргарита',
    description: 'Томатный соус, моцарелла, свежий базилик',
    price: 450,
    image: 'https://cdn.poehali.dev/projects/b5fe89ca-42ef-4ce7-8378-c2080539a932/files/a1d8895c-19c7-40fd-afee-ee0ac7810419.jpg',
    size: '30см'
  },
  {
    id: 2,
    name: 'Пепперони',
    description: 'Томатный соус, моцарелла, пепперони',
    price: 550,
    image: 'https://cdn.poehali.dev/projects/b5fe89ca-42ef-4ce7-8378-c2080539a932/files/fbd1766a-5e78-4051-986d-d384ee27db73.jpg',
    size: '30см'
  },
  {
    id: 3,
    name: 'Вегетарианская',
    description: 'Томатный соус, моцарелла, перец, грибы, оливки, помидоры',
    price: 500,
    image: 'https://cdn.poehali.dev/projects/b5fe89ca-42ef-4ce7-8378-c2080539a932/files/53c1d75d-c9bb-4459-8ff4-187436979819.jpg',
    size: '30см'
  },
  {
    id: 4,
    name: 'Четыре сыра',
    description: 'Моцарелла, пармезан, дор блю, чеддер',
    price: 650,
    image: 'https://cdn.poehali.dev/projects/b5fe89ca-42ef-4ce7-8378-c2080539a932/files/a1d8895c-19c7-40fd-afee-ee0ac7810419.jpg',
    size: '30см'
  },
  {
    id: 5,
    name: 'Мясная',
    description: 'Томатный соус, моцарелла, ветчина, бекон, курица',
    price: 700,
    image: 'https://cdn.poehali.dev/projects/b5fe89ca-42ef-4ce7-8378-c2080539a932/files/fbd1766a-5e78-4051-986d-d384ee27db73.jpg',
    size: '30см'
  },
  {
    id: 6,
    name: 'Гавайская',
    description: 'Томатный соус, моцарелла, ветчина, ананасы',
    price: 600,
    image: 'https://cdn.poehali.dev/projects/b5fe89ca-42ef-4ce7-8378-c2080539a932/files/53c1d75d-c9bb-4459-8ff4-187436979819.jpg',
    size: '30см'
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    comment: ''
  });

  const addToCart = (pizza: Pizza) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === pizza.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...pizza, quantity: 1 }];
    });
    toast.success(`${pizza.name} добавлена в корзину`);
  };

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Корзина пуста');
      return;
    }
    toast.success('Заказ оформлен! Мы свяжемся с вами в ближайшее время');
    setCart([]);
    setOrderOpen(false);
    setFormData({ name: '', phone: '', address: '', comment: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🍕</div>
            <div>
              <h1 className="text-2xl font-bold text-primary">PizzaTime</h1>
              <p className="text-sm text-muted-foreground">Доставка за 30 минут</p>
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="lg" className="relative gap-2">
                <Icon name="ShoppingCart" size={20} />
                Корзина
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-2xl">Ваша корзина</SheetTitle>
                <SheetDescription>
                  {cart.length === 0 ? 'Корзина пуста' : `Товаров: ${cart.reduce((sum, item) => sum + item.quantity, 0)}`}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.size}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, -1)}>
                                <Icon name="Minus" size={14} />
                              </Button>
                              <span className="font-medium w-8 text-center">{item.quantity}</span>
                              <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, 1)}>
                                <Icon name="Plus" size={14} />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{item.price * item.quantity} ₽</p>
                              <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)} className="h-auto p-0 text-destructive">
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="mt-6 space-y-4">
                  <Separator />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Итого:</span>
                    <span className="text-primary">{totalPrice} ₽</span>
                  </div>
                  <Button size="lg" className="w-full" onClick={() => setOrderOpen(true)}>
                    Оформить заказ
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-bold mb-4 text-foreground">Вкуснейшая пицца в городе</h2>
          <p className="text-xl text-muted-foreground">Свежие ингредиенты, горячая доставка за 30 минут</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pizzas.map((pizza, index) => (
            <Card key={pizza.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative overflow-hidden group">
                <img src={pizza.image} alt={pizza.name} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                <Badge className="absolute top-4 right-4">{pizza.size}</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{pizza.name}</CardTitle>
                <CardDescription className="text-base">{pizza.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">{pizza.price} ₽</span>
                <Button onClick={() => addToCart(pizza)} className="gap-2">
                  <Icon name="Plus" size={18} />
                  В корзину
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-5xl">⚡</div>
              <h3 className="text-xl font-bold">Быстрая доставка</h3>
              <p className="text-muted-foreground">Привезём горячую пиццу за 30 минут</p>
            </div>
            <div className="space-y-3">
              <div className="text-5xl">🌿</div>
              <h3 className="text-xl font-bold">Свежие продукты</h3>
              <p className="text-muted-foreground">Только качественные ингредиенты</p>
            </div>
            <div className="space-y-3">
              <div className="text-5xl">💯</div>
              <h3 className="text-xl font-bold">100% гарантия</h3>
              <p className="text-muted-foreground">Вернём деньги, если не понравится</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-3xl mb-4">🍕</div>
          <h3 className="text-xl font-bold mb-2">PizzaTime</h3>
          <p className="text-white/70 mb-4">Лучшая пицца в городе</p>
          <div className="flex justify-center gap-4 text-white/70">
            <span>📞 +7 (999) 123-45-67</span>
            <span>•</span>
            <span>📧 info@pizzatime.ru</span>
          </div>
        </div>
      </footer>

      {orderOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl">Оформление заказа</CardTitle>
              <CardDescription>Заполните форму, и мы свяжемся с вами</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="space-y-2">
                  <Label>Способ получения</Label>
                  <RadioGroup value={deliveryType} onValueChange={(value) => setDeliveryType(value as 'delivery' | 'pickup')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="cursor-pointer">Доставка</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="cursor-pointer">Самовывоз</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Имя *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Иван Иванов"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                {deliveryType === 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес доставки *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="Улица, дом, квартира"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий к заказу</Label>
                  <Input
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    placeholder="Особые пожелания"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold">Ваш заказ:</h4>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{item.price * item.quantity} ₽</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Итого:</span>
                    <span className="text-primary">{totalPrice} ₽</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setOrderOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" className="flex-1">
                    Подтвердить заказ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
