import Vue from 'vue'
import {
  Button,
  Form, FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  Col,
  Row,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane
} from 'element-ui'

Vue.use(Button)
  .use(Tabs)
  .use(TabPane)
  .use(Alert)
  .use(Cascader)
  .use(Select)
  .use(Option)
  .use(Tag)
  .use(Tree)
  .use(Dialog)
  .use(Switch)
  .use(Pagination)
  .use(Tooltip)
  .use(Table)
  .use(TableColumn)
  .use(Col)
  .use(Row)
  .use(Form).use(FormItem)
  .use(Input)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Breadcrumb)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
