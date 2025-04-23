import { useReducer, useEffect, useRef, useState, useContext, createContext } from 'react';
import {fetchDataFunc, FetchDataProps} from "./fetchFunction"
// Action types
const FETCH_INIT = 'FETCH_INIT';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_ERROR = 'FETCH_ERROR';
const ALTER_DATA = 'ALTER_DATA';
const REFETCH = 'REFETCH';


interface State {
  data: any;
  loading: boolean;
  error: string | null;
  refetching: boolean;
}

type Action =
  | { type: 'FETCH_INIT' }
  | { type: 'FETCH_SUCCESS'; payload: any }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ALTER_DATA'; payload: any }
  | { type: 'REFETCH'; payload: any };
// Reducer function
const dataFetchReducer = (state:State, action:Action) => {
  switch (action.type) {
    case FETCH_INIT:
      return { ...state, loading: true, error: null };
    case REFETCH:
      return { ...state, refetching: true, error: null };
    case FETCH_SUCCESS:
      return { ...state, loading: false, refetching: false, data: action.payload };
    case FETCH_ERROR:
      return { ...state, loading: false, refetching: false, error: action.payload, data:null };
    case ALTER_DATA:
      return { ...state, data: action.payload, loading: false };
    default:
      throw new Error('Unhandled action type');
  }
};
interface AuthContextType {
    logout?: () => void;
    customActions?: ActionObjectList; // Add customActions type
    baseURL?:string;
    token?:string;
  }
  
  // Define the ActionObject type (similar to what you defined previously)
  type ActionObject = {
    codes: number[];
    action: () => void;
  };
  
  type ActionObjectList = ActionObject[];
  
  // Update AuthContext
  const AuthContext = createContext<AuthContextType | null>(null);
  


  type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = 
  Pick<T, Exclude<keyof T, Keys>> & 
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>> }[Keys];

interface BaseApiProps {
  apiParameters?: any[];
  apiCustomReturnFunction?: (data: any) => any;
  onError?: (error: any) => void;
  runOnTimeOfScreenMount?: boolean;
  initialLoadingState?: boolean;
  initialData?: any;
  reFetchDependencies?: any[];
  logoutFunction?: () => void;
}

interface ApiCallingFunctionProps {
  apiCallingFunction: (...params: any[]) => Promise<any>;
  apiConfig?: never;
}

interface ApiConfigProps {
  apiCallingFunction?: never;
  apiConfig: FetchDataProps;
}

type UseApiProps = RequireAtLeastOne<BaseApiProps & (ApiCallingFunctionProps | ApiConfigProps), 'apiCallingFunction' | 'apiConfig'>;

// Hook that handles API calls and status codes
const useApiHook = ({
  apiCallingFunction,
  apiParameters,
  apiCustomReturnFunction,
  onError,
  runOnTimeOfScreenMount,
  initialLoadingState,
  initialData = null,
  reFetchDependencies = [],
  apiConfig,
  logoutFunction, // Optional: Logout function can be passed as a prop
}: UseApiProps) => {
  const authContext = useContext(AuthContext); // Use the AuthContext if available
  const finalLogoutFunction = authContext?.logout || logoutFunction; // Fallback to passed logoutFunction if context is not present

  console.log(authContext)
  const initialState = {
    data: initialData,
    loading: !!initialLoadingState,
    error: null,
    refetching: false,
  };

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);
  const prevDependenciesRef = useRef(reFetchDependencies);

  const alterData = (data:any) => {
    dispatch({ type: ALTER_DATA, payload: data });
  };

  // Fetching function with status code handling
  const fetchData = async ({showLoader = true, params = apiParameters, customReturnFunc = apiCustomReturnFunction}:{
    showLoader?:boolean,params?:any[] |undefined,customReturnFunc?:((i:any)=>any)|undefined
  }) => {
    if (showLoader) dispatch({ type: FETCH_INIT });

    try {
      let response
      if(apiCallingFunction){
        const apiParams:any[] =params? [...params]:[]
        response = await apiCallingFunction(...apiParams);
      }else{
        const url = authContext?.baseURL as string  
        response = await fetchDataFunc({
          ...apiConfig,
          url:apiConfig?.url|| url ,
          endpoint:apiConfig?.endpoint as string,
          token:apiConfig?.token || authContext?.token,
          body:params?params[0] : apiConfig?.body,



        })
      }

      // console.log(response)

       // Check custom actions before default cases
       const customAction = authContext?.customActions?.find(actionObj =>
        actionObj?.codes?.includes(response?.statusCode)
      );
      if (customAction) {
        customAction.action();
        return;
      }



      switch (response?.statusCode) {
        // Informational responses
        case 100:
        case 101:
        case 102:
        case 103:
          if (onError) onError(response);
          break;

        // Success codes
        case 200:
        case 201:
        case 202:
        case 203:
        case 204:
        case 205:
        case 206:
        case 207:
        case 208:
        case 226:
          const data = customReturnFunc ? customReturnFunc(response) : response;
          dispatch({ type: FETCH_SUCCESS, payload: data });
          break;

        // Redirection codes
        case 300:
        case 301:
        case 302:
        case 303:
        case 304:
        case 305:
        case 306:
        case 307:
        case 308:
          if (onError) onError(response);
          break;

        // Client error responses
        case 400:
        case 402:
        
        case 404:
        case 405:
        case 406:
        case 407:
        case 408:
        case 409:
        case 410:
        case 411:
        case 412:
        case 413:
        case 414:
        case 415:
        case 416:
        case 417:
        case 418:
        case 421:
        case 422:
        case 423:
        case 424:
        case 425:
        case 426:
        case 428:
        case 429:
        case 431:
        case 451:
          if (onError) onError(response);
        //  if(response?.data?.msg ) ToastAndroid.show(response?.data?.msg , ToastAndroid.LONG);
          dispatch({ type: FETCH_ERROR, payload: response?.data?.msg || 'Client error' });
          break;

        case 401:
        case 403:
          // Unauthorized - call the finalLogoutFunction (either from context or prop)
          if (finalLogoutFunction) {
            finalLogoutFunction();
          }
          break;

        // Server error responses
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
        case 505:
        case 506:
        case 507:
        case 508:
        case 510:
        case 511:
          if (onError) onError(response);
          if (onError) onError(response);
          if (onError) onError(response);

          dispatch({ type: FETCH_ERROR, payload: response?.data?.msg || 'Server error' });
          break;

        default:
          dispatch({ type: FETCH_ERROR, payload: 'Unexpected status code' });
      }
    } catch (error:any) {
      dispatch({ type: FETCH_ERROR, payload: error?.message || 'Something went wrong' });
      if (onError) onError(error);
    }
  };

  useEffect(() => {
    if (runOnTimeOfScreenMount) fetchData({});

    if (JSON.stringify(reFetchDependencies) !== JSON.stringify(prevDependenciesRef.current)) {
      fetchData({});
    }

    prevDependenciesRef.current = reFetchDependencies;
  }, [...reFetchDependencies]);

  return { ...state, fetchData, alterData };
};

export { AuthContext, useApiHook };
