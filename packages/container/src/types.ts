import type { ComponentTrust } from '@bos-web-engine/common';
import { VNode } from 'preact';

export interface WebEngineMeta {
  componentId?: string;
  isProxy?: boolean;
  parentMeta?: WebEngineMeta;
}

export type BuildRequestCallback = () => CallbackRequest;

export interface CallbackRequest {
  promise: Promise<any>;
  rejecter?: (reason: any) => void;
  resolver?: (value: any) => void;
}

export type RequestMap = { [key: string]: CallbackRequest };
export type CallbackMap = { [key: string]: Function };

export type DeserializePropsCallback = (params: DeserializePropsParams) => any;
export interface DeserializePropsParams {
  componentId: string;
  props: SerializedProps;
}

export type EventArgs = { event: any };

type ComponentCallbackInvocationType = 'component.callbackInvocation';
type ComponentCallbackResponseType = 'component.callbackResponse';
type ComponentDomCallbackType = 'component.domCallback';
type ComponentRenderType = 'component.render';
type ComponentUpdateType = 'component.update';
export type EventType =
  | ComponentCallbackInvocationType
  | ComponentCallbackResponseType
  | ComponentDomCallbackType
  | ComponentRenderType
  | ComponentUpdateType;

export interface InitNearParams {
  renderComponent: () => void;
  rpcUrl: string;
}

export interface InitSocialParams {
  endpointBaseUrl: string;
  renderComponent: Function;
  sanitizeString: (s: string) => string;
  componentId: string;
}

export interface InvokeCallbackParams {
  args: SerializedArgs | EventArgs;
  callback: Function;
}

export interface InvokeComponentCallbackParams {
  args: SerializedArgs;
  buildRequest: BuildRequestCallback;
  callbacks: CallbackMap;
  componentId: string;
  invokeCallback: (args: InvokeCallbackParams) => any;
  method: string;
  postCallbackInvocationMessage: PostMessageComponentInvocationCallback;
  requests: { [key: string]: CallbackRequest };
  serializeArgs: SerializeArgsCallback;
  targetId: string;
}

export interface KeyValuePair {
  [key: string]: any;
}

export interface NodeProps extends Props {
  children: any[];
}

export interface DomCallback {
  args: SerializedArgs;
  componentId?: string;
  method: string;
  type: ComponentDomCallbackType;
}

export type MessagePayload =
  | ComponentCallbackInvocation
  | ComponentCallbackResponse
  | DomCallback
  | ComponentRender
  | ComponentUpdate;

export interface PostMessageEvent {
  data: MessagePayload;
}

export interface PostMessageParams {
  type: EventType;
}

export type PostMessageCallback = <T extends PostMessageParams>(
  message: T
) => void;

export type PostMessageComponentInvocationCallback = (
  message: PostMessageComponentCallbackInvocationParams
) => void;
export interface ComponentCallbackInvocation extends PostMessageParams {
  args: SerializedArgs;
  method: string;
  originator: string;
  requestId: string;
  targetId: string;
  type: ComponentCallbackInvocationType;
}

export interface PostMessageComponentCallbackInvocationParams {
  args: any[];
  callbacks: CallbackMap;
  method: string;
  postMessage: PostMessageCallback;
  requestId: string;
  serializeArgs: SerializeArgsCallback;
  targetId: string;
  componentId: string;
}

export type PostMessageComponentResponseCallback = (
  message: PostMessageComponentCallbackResponseParams
) => void;
export interface ComponentCallbackResponse extends PostMessageParams {
  componentId: string;
  requestId: string;
  result: string; // stringified JSON in the form of { result: any, error: string }
  targetId: string;
  type: ComponentCallbackResponseType;
}
export interface PostMessageComponentCallbackResponseParams {
  componentId: string;
  error: Error | null;
  postMessage: PostMessageCallback;
  requestId: string;
  result: any;
  targetId: string;
}

export interface ComponentRender extends PostMessageParams {
  childComponents: ComponentChildMetadata[];
  componentId: string;
  node: SerializedNode;
  trust: ComponentTrust;
  type: ComponentRenderType;
}
export interface PostMessageComponentRenderParams {
  childComponents: ComponentChildMetadata[];
  componentId: string;
  node: SerializedNode;
  postMessage: PostMessageCallback;
  trust: ComponentTrust;
}

export interface ComponentUpdate extends PostMessageParams {
  props: any;
  type: ComponentUpdateType;
  componentId: string;
}

interface PreactifyParams {
  node: Node;
  builtinPlaceholders: BuiltinComponentPlaceholders;
  createElement: PreactCreateElement;
}

export type PreactifyCallback = (params: PreactifyParams) => any;

export type DecodeJsonStringCallback = (value: string) => string;

export interface ComposeSerializationMethodsParams {
  buildRequest: BuildRequestCallback;
  builtinComponents: BuiltinComponents;
  callbacks: CallbackMap;
  decodeJsonString: DecodeJsonStringCallback;
  parentContainerId: string | null;
  postCallbackInvocationMessage: PostMessageComponentInvocationCallback;
  preactRootComponentName: string;
  postMessage: PostMessageCallback;
  requests: RequestMap;
}

export type ComposeSerializationMethodsCallback = (
  params: ComposeSerializationMethodsParams
) => {
  deserializeProps: DeserializePropsCallback;
  serializeArgs: SerializeArgsCallback;
  serializeNode: SerializeNodeCallback;
  serializeProps: SerializePropsCallback;
};

export interface ProcessEventParams {
  buildRequest: BuildRequestCallback;
  callbacks: CallbackMap;
  componentId: string;
  deserializeProps: DeserializePropsCallback;
  invokeCallback: (args: InvokeCallbackParams) => any;
  invokeComponentCallback: (args: InvokeComponentCallbackParams) => any;
  parentContainerId: string | null;
  postCallbackInvocationMessage: PostMessageComponentInvocationCallback;
  postCallbackResponseMessage: PostMessageComponentResponseCallback;
  postMessage: PostMessageCallback;
  renderDom: (node: any) => object;
  renderComponent: () => void;
  requests: { [key: string]: CallbackRequest };
  serializeArgs: SerializeArgsCallback;
  serializeNode: SerializeNodeCallback;
  setProps: (props: object) => boolean;
}

export interface InitContainerParams {
  containerMethods: {
    buildEventHandler: (params: ProcessEventParams) => Function;
    buildRequest: BuildRequestCallback;
    buildSafeProxy: BuildSafeProxyCallback;
    composeSerializationMethods: ComposeSerializationMethodsCallback;
    decodeJsonString: DecodeJsonStringCallback;
    dispatchRenderEvent: DispatchRenderEventCallback;
    // encodeJsonString,
    getBuiltins: GetBuiltinsCallback;
    // initNear,
    // initSocial,
    invokeCallback: (args: InvokeCallbackParams) => any;
    invokeComponentCallback: (args: InvokeComponentCallbackParams) => any;
    postCallbackInvocationMessage: PostMessageComponentInvocationCallback;
    postCallbackResponseMessage: PostMessageComponentResponseCallback;
    postComponentRenderMessage: (p: any) => void;
    postMessage: PostMessageCallback;
    preactify: PreactifyCallback;
  };
  context: {
    builtinPlaceholders: BuiltinComponentPlaceholders;
    BWEComponent: Function;
    componentId: string;
    createElement: PreactCreateElement;
    componentPropsJson: string;
    parentContainerId: string | null;
    preactHooksDiffed: (node: VNode) => void;
    preactRootComponentName: string;
    props: any;
    render: PreactRender;
    renderContainerComponent: RenderContainerComponentCallback;
    setProps: (props: object) => boolean;
    trust: string;
  };
}

export interface Props extends KeyValuePair {
  __domcallbacks?: { [key: string]: any };
  __componentcallbacks?: { [key: string]: any };
  children?: any[];
}

export type SerializedArgs = Array<
  string | number | object | any[] | { __componentMethod: string }
>;
export type SerializeArgsCallback = (
  args: SerializeArgsParams
) => SerializedArgs;
export interface SerializeArgsParams {
  args: any[];
  callbacks: CallbackMap;
  componentId: string;
}

export interface PreactElement {
  type: string;
  props: any;
}

export type PreactCreateElement = (
  type: string | Function,
  props: any,
  children: any
) => PreactElement;
type CreateSerializedBuiltin = ({
  props,
  children,
}: BuiltinProps<any>) => PreactElement;

export type PreactRender = (component: Function, target: HTMLElement) => void;

export interface GetBuiltinsParams {
  createElement: PreactCreateElement;
}

export type GetBuiltinsCallback = (
  params: GetBuiltinsParams
) => BuiltinComponents;

export interface BuiltinComponents {
  Checkbox: CreateSerializedBuiltin;
  CommitButton: CreateSerializedBuiltin;
  Dialog: CreateSerializedBuiltin;
  DropdownMenu: CreateSerializedBuiltin;
  Files: CreateSerializedBuiltin;
  Fragment: CreateSerializedBuiltin;
  InfiniteScroll: CreateSerializedBuiltin;
  IpfsImageUpload: CreateSerializedBuiltin;
  Link: CreateSerializedBuiltin;
  Markdown: CreateSerializedBuiltin;
  OverlayTrigger: CreateSerializedBuiltin;
  Tooltip: CreateSerializedBuiltin;
  Typeahead: CreateSerializedBuiltin;
}

export interface Node {
  type: string | Function;
  props?: NodeProps;
  key?: string;
}

interface ComponentChildMetadata {
  componentId: string;
  props: Props;
  source: string;
  trust: ComponentTrust;
}

export interface SerializeNodeParams {
  node: Node;
  childComponents: ComponentChildMetadata[];
  parentId: string;
}
export type SerializeNodeCallback = (
  args: SerializeNodeParams
) => SerializedNode;

export interface SerializedNode {
  childComponents?: ComponentChildMetadata[];
  className?: string;
  type: string;
  props: NodeProps | ComponentProps;
}

export interface SerializedProps extends KeyValuePair {
  __componentcallbacks?: {
    [key: string]: SerializedComponentCallback;
  };
}

export interface SerializePropsParams {
  componentId?: string;
  parentId: string;
  props: any;
}

export type SerializePropsCallback = (params: SerializePropsParams) => Props;

export interface SerializedComponentCallback {
  __componentMethod: string;
  parentId: string;
}

export interface ComponentProps {
  __bweMeta?: WebEngineMeta;
  children?: any[];
  className?: string;
  id: string;
}

// builtin component props
export interface FilesProps {
  accepts: string[];
  className: string;
  clickable: boolean;
  minFileSize: number;
  multiple: boolean;
  onChange: (files: any[]) => {};
}

export interface IpfsImageUploadProps {
  img: string;
}

export interface InfiniteScrollProps {
  pageStart: number;
  loadMore: () => {};
  hasMore: boolean;
  loader: any; // Component
}

export interface MarkdownProps {
  text: string;
}

export interface OverlayTriggerProps {
  delay: { hide: number; show: number };
  overlay: any;
  placement: string;
  show: boolean;
  trigger: string[];
}

export interface TypeaheadProps {
  multiple: boolean;
  onChange: (value: any) => {};
  options: string[];
  placeholder: string;
}

type BuiltinPropsTypes =
  | object // TODO props for remaining builtins
  | FilesProps
  | IpfsImageUploadProps
  | InfiniteScrollProps
  | MarkdownProps
  | OverlayTriggerProps
  | TypeaheadProps
  | ComponentProps;

export interface BuiltinProps<T extends BuiltinPropsTypes> {
  children: any[];
  props: T;
}

export interface BuiltinComponentPlaceholders {
  Widget: Function;
}

interface RenderComponentParams {
  stateUpdate?: string;
  BWEComponent: Function;
  stateUpdates: Map<string, any[]>;
  createElement: PreactCreateElement;
  render: Function;
  componentId: string;
}

export type RenderContainerComponentCallback = (
  params: RenderComponentParams
) => PreactElement | undefined;

export interface DispatchRenderEventParams {
  builtinComponents: BuiltinComponents;
  callbacks: CallbackMap;
  componentId: string;
  decodeJsonString: DecodeJsonStringCallback;
  node: Node;
  nodeRenders: Map<string, string>;
  postComponentRenderMessage: (p: any) => void;
  postMessage: PostMessageCallback;
  preactRootComponentName: string;
  serializeNode: (p: SerializeNodeParams) => SerializedNode;
  serializeProps: SerializePropsCallback;
  trust: string;
}
export type DispatchRenderEventCallback = (
  params: DispatchRenderEventParams
) => void;

interface BuildSafeProxyParams {
  props: Props;
  componentId: string;
}

export type BuildSafeProxyCallback = (params: BuildSafeProxyParams) => object;
