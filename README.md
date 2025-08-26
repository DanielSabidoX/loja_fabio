<div class="carta">
  <h1>Loja Fabio</h1>

  <p>
    Este projeto trata-se do Projeto Final do módulo 2 do Curso Angular da ADA Tech.
  </p>

  <p>
    Foi construído um APP de loja on-line com carrinho de compras.
  </p>

  <h2>Principais componentes utilizados (externos)</h2>
  <ul>
    <li>Bootstrap 5.3: para estilos e icones de botoes</li>
    <li>Ngx-Toastr: para notificações amigáveis</li>
    <li>Ngx-mask: para formatação de campos</li>
    <li>Angular Translate: para internacionalização (i18n)</li>
    <li>Bootstrap Icons: para ícones diversos</li>
  </ul>

  <h2>Estrutura do projeto</h2>
  <p>
    O projeto está estruturado em módulos, componentes e serviços. A navegação é gerenciada pelo Angular Router.
    A seguir estão os principais diretórios e seus conteúdos:
  </p>
  <ul>
    <li><strong>app/components</strong>: contém os componentes da aplicação, como header, footer, home, product-details, cart, login, register, user-profile e admin.</li>
    <li><strong>app/services</strong>: contém os serviços que gerenciam o estado global da aplicação, como AuthService, CartService, ProductService e UserService.</li>
    <li><strong>app/services</strong>: contém, também, o AdminGuard e AuthGuard para proteger as rotas com privilégios e autenticação</li>
    <li><strong>app/helpers</strong>: contém pipes e validadores personalizados.</li>
    <li><strong>app/types</strong>: contpem a estruturas dos componentes cart-item, product e user</li>
  </ul>

  <h2>Funcionamento</h2>
  <p>
    Inicialmente é feita uma consulta no <a href="https://fakestoreapi.com/products/categories" target="_blank">https://fakestoreapi.com/products/categories</a> para buscar a lista de categorias que fará a carga inicial no menu. Essas categorias serão usadas como filtros para o cliente encontrar mais rápido o produto.
  </p>
  <p>
    As categorias e produtos são carregados através de serviços que fazem requisições HTTP para a API Fake Store. O componente <strong>home</strong> renderiza a lista de produtos, enquanto o componente <strong>header</strong> renderiza o menu e as categorias.
    Os objetos produtos e categorias são tipados através de interfaces que definem as propriedades esperadas. Também são armazenados na service para evitar várias consultas ao servidor ao muda de componente na navegação.
  </p>
  <p>
    O cliente pode filtrar os produtos por categoria, título/descrição e faixa de preço. Ao clicar em detalhes de um produto, o cliente é direcionado para a página de detalhes do produto, onde pode escolher a quantidade e adicionar ao carrinho.
    Na pagina iniciar o cliente já pode adicionar itens ao carrinho, mas para finalizar a compra é necessário estar autenticado.
    O carrinho de compras é gerenciado por um serviço que mantém o estado dos itens adicionados. O cliente pode visualizar o carrinho, alterar quantidades, remover itens e finalizar a compra. 
    Se não estiver autenticado, uma mensagem alerta que é necessário fazer login.
  </p>

  <h2>Estado global</h2>
  <p>
    O estado global da aplicação é gerenciado através de services com signals. O carrinho de compras, o usuário autenticado e os produtos são armazenados em services dedicados.
    Isso permite que diferentes componentes acessem e modifiquem o estado compartilhado de forma reativa.
    Por exemplo, o componente do header exibe a quantidade de itens no carrinho, que é atualizado automaticamente quando o cliente adiciona ou remove itens.
  </p>

  <h2>Autenticação</h2>
  <p>
    A autenticação é feita através do serviço AuthService, que simula o login consultando a API Fake Store. O token retornado é armazenado no localStorage para manter a sessão ativa.
    O serviço também mantém o estado de autenticação e os dados do usuário logado através de signals.
    O cliente pode se registrar, fazer login e logout. Algumas rotas são protegidas e só podem ser acessadas por usuários autenticados.
    O nome do usuário logado é exibido no header, junto com opções para acessar o perfil e sair.
  </p>

  <h2>Autorização</h2>
  <p>
    A autorização é implementada através de guards que protegem rotas específicas. O AdminGuard garante que apenas usuários com privilégios de administrador possam acessar a área administrativa.
    No caso deste projeto, o usuário com username "johnd" é considerado administrador.
    O AuthGuard protege rotas que requerem autenticação, redirecionando usuários não autenticados para a página de login.
  </p>

  <h2>Internacionalização (i18n)</h2>
  <p>
    A aplicação suporta múltiplos idiomas (Inglês e Portiguês) através do Angular Translate. As traduções são armazenadas em arquivos JSON separados para cada idioma.
    O cliente pode alternar entre os idiomas disponíveis (inglês e português) através de um toggle no header. As traduções são aplicadas dinamicamente no component NAV.
  </p>

  <h2>Considerações finais</h2>
  <p>
    Este projeto demonstra o uso de Angular para construir uma aplicação web completa, com navegação, estado global, autenticação e interação com APIs externas.
    Foram aplicados conceitos de componentes, serviços, rotas, formulários reativos e boas práticas de desenvolvimento.
    O código está organizado e comentado para facilitar a manutenção e futuras melhorias.
  </p>
  <p>
    Obrigado por visitar a Loja Fabio! Boas compras!
</div>

