# ⚡ Calculadora de Dimensionamento Elétrico

Software técnico de alta performance desenvolvido por **Davi Santana** para o dimensionamento preciso de condutores elétricos por queda de tensão. O projeto foca em entregar autoridade técnica para profissionais de automação e elétrica através de memoriais descritivos profissionais.

---

## 🚀 Funcionalidades Completas

### 📥 Entrada de Parâmetros
* **Dados de Obra**: Nome do cliente e local da instalação para personalização de relatórios.
* **Tensão Nominal ($V$)**: Suporte a sistemas de 127V, 220V e 380V.
* **Corrente de Projeto ($A$)**: Entrada precisa baseada na carga do circuito.
* **Distância ($m$)**: Comprimento total do trecho condutor.
* **Queda de Tensão Máxima ($%$)**: Ajuste conforme normas técnicas locais (Ex: 4%).

### 📤 Memorial de Cálculo (Output)
* **Bitola Sugerida**: Recomendação comercial imediata em mm².
* **Queda de Tensão Real**: Cálculo percentual do impacto no circuito.
* **Perda de Tensão ($V$)**: Valor exato da queda em Volts.
* **Seção Exata**: Resultado bruto do cálculo matemático ($mm^2$) antes da padronização comercial.
* **Tensão Calculada**: Confirmação do nível de tensão base utilizado.

---

## 📐 Base de Engenharia

O motor de cálculo utiliza a constante de resistividade do cobre ($\rho = 0,0172$) e a fórmula padrão para circuitos de baixa tensão:

$$S = \frac{2 \cdot \rho \cdot L \cdot I}{\Delta V}$$

---

## 🛠️ Stack Tecnológica

* **Interface**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/).
* **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) (Visual Profissional / Dark Mode).
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/).
* **Exportação**: [jsPDF](https://github.com/parallax/jsPDF) + [html2canvas](https://html2canvas.hertzen.com/) com tratamento de cores moderno.

---

## 🛣️ Roadmap de Evolução

- [x] Memorial de Cálculo completo
- [x] Exportação de Relatório PDF Personalizado
- [ ] Integração com WhatsApp para envio de orçamentos
- [ ] Cálculo de dimensionamento de disjuntores e eletrodutos
- [ ] Listagem de materiais com link de afiliados

---

## 👨‍💻 Sobre o Desenvolvedor

**Davi Santana** Estudante de Engenharia de Controle e Automação no **CEFET-MG** (Campus Leopoldina) e Técnico em Automação Industrial. Fundador da **Niobio Labs**, focada em soluções inteligentes para o setor elétrico e "maker".
