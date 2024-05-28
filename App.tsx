/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import WebView from 'react-native-webview';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [webListInfo, setWebListInfo] = useState([
    {
      id: 0,
      url: 'https://www.ilbe.com',
      entranceTime: new Date().toISOString(),
    },
    {id: 1, url: 'https://www.dcinside.com', entranceTime: ''},
    {id: 2, url: 'https://www.naver.com', entranceTime: ''},
    {id: 3, url: 'https://www.teamblind.com/kr/', entranceTime: ''},
  ]);
  const [webUrl, setWebUrl] = useState('https://www.ilbe.com');
  const [appState, setAppState] = useState(AppState.currentState);
  const [lastTransition, setLastTransition] = useState(
    new Date().toISOString(),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        setLastTransition(new Date().toISOString()); // 포그라운드 시간체크
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const handleWebviewUrl = (url, i) => {
    setWebListInfo(prevWebList =>
      prevWebList?.map(item =>
        item?.id === i
          ? {...item, entranceTime: new Date().toISOString()}
          : item,
      ),
    );

    setWebUrl(url);
  };

  const siteList = [
    {id: 0, name: '일베'},
    {id: 1, name: '디시'},
    {id: 2, name: '네이버'},
    {id: 3, name: '블라인드'},
  ];

  const [messageFromWebView, setMessageFromWebView] = useState('');

  const onWebViewMessage = e => {
    const data = JSON.parse(e.nativeEvent.data);
    console.log('Received data from webview:', data);
    setMessageFromWebView(e.nativeEvent.data);
  };

  const onMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.buttonId) {
      if (data.error) {
        console.error(
          `Error fetching data for button ${data.buttonId}:`,
          data.error,
        );
      } else {
        console.log(`Data for button ${data.buttonId}:`, data.data);
        // Do something with the API data
      }
    }
  };

  const injectedJavaScript = `
const ilbeBoardLink = document.querySelector('h2.index-item__header > a[href="/list/ilbe"]');
const c2eBoardLink = document.querySelector('h2.index-item__header > a[href="/list/c2e"]');
const companyReviewLink = document.querySelector('li.swiper-slide a[href="/kr/company"]');
const companyHomeLink = document.querySelector('li.swiper-slide a[href="/kr/"]');
const likeLink = document.querySelectorAll('.wrap-info a.like');

// '일베로' 버튼 선택
const btnVoteUp = document.querySelector('#btn_vote_up');

function sendMessageWithTime(linkName) {
  const clickTime = new Date().toISOString();
  window.ReactNativeWebView.postMessage(linkName + ' clicked at ' + clickTime);
}

if (btnVoteUp) {
  btnVoteUp.addEventListener('click', function(event) {
    sendMessageWithTime('Ilbe Upvote');
  });
}

if (ilbeBoardLink) {
  ilbeBoardLink.addEventListener('click', function(event) {
    sendMessageWithTime('Ilbe link');
  });
} 

if (c2eBoardLink) {
  c2eBoardLink.addEventListener('click', function(event) {
    sendMessageWithTime('Ilbe C2E link');
  });
}

if (companyReviewLink) {
  companyReviewLink.addEventListener('click', function(event) {
    sendMessageWithTime('Company Review link');
  });
}

if (companyHomeLink) {
  companyHomeLink.addEventListener('click', function(event) {
    sendMessageWithTime('Company Home link' + companyHomeLink);
  });
}

// 블라인드 글 목록 좋아요 버튼 이벤트 확인
  document.body.addEventListener('click', function(event) {
    const likeButton = event.target.closest('.like');
    if (likeButton) {
      event.preventDefault();

      // 'like' 버튼의 부모 요소에서 제목 링크를 찾음
      const articleElement = likeButton.closest('.article');
      let titleText = '';
      if (articleElement) {
        const titleLink = articleElement.querySelector('a.tit');
        if (titleLink) {
          titleText = titleLink.textContent || titleLink.innerText;
        }
      }

      // React Native 앱으로 정보 전송
      window.ReactNativeWebView.postMessage('Like clicked for: ' + titleText);
    }
  });

  // 일베 로그인 정보
  

true; 
`;

  const injectedJavaScriptTest = `
  function sendDataToApp() {
    const keyword = window.keyword || 'No keyword defined';
    const csrfVal = window.csrf_val || 'No CSRF token defined';
    const loginUser = window.loginuser || 'No login user info';

    // React Native 앱으로 데이터 전송
    window.ReactNativeWebView.postMessage(
      'Keyword: ' + keyword + ', CSRF Token: ' + csrfVal + ', Login User: ' + loginUser
    );
  }

  // 페이지 로드가 완료되면 데이터 전송 함수 실행
  if (document.readyState === 'complete') {
    sendDataToApp();
  } else {
    window.onload = sendDataToApp;
  }

  true; // 스크립트가 정상적으로 종료되었음을 보장
`;

  const injectedJavaScriptBlindTest = `
    (function() {
      var element = document.querySelector('.signed_in');
      var hasSignedInClass = element !== null;
      window.ReactNativeWebView.postMessage(hasSignedInClass.toString());
      return true;
    })();
  `;

  // console.log('messageFromWebView', messageFromWebView);

  const handleWebViewNavigationStateChange = newNavState => {
    const {url} = newNavState;
    if (!url) return;
    console.log('newnavstateurl', url);
  };

  // 현재 url 주소, 유저가 어떤 태그 버튼 눌렀는지 확인.

  const INJECTED_JAVASCRIPT = `
  (function() {
    var button = document.getElementById('btn_vote_up');
    button.addEventListener('click', function() {
      var dataValue = button.getAttribute('data');
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://m.ilbe.com/vote/up/' + dataValue, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      // POST 요청 페이로드
      var payload = 'referrer=https%3A%2F%2Fm.ilbe.com%2Fview%2F11533640169&ckCsrfToken=7de31ed206f5b1d086174f2771af5fa1';
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          var message = {
            status: xhr.status,
            response: xhr.responseText,
            buttonId: button.id
          };
          window.ReactNativeWebView.postMessage(JSON.stringify(message));
        }
      };
      xhr.send(payload);   // 필요한 파라미터 추가
    });
  })();
`;

  // const INJECTED_JAVASCRIPT = `(function() {
  //   var open = XMLHttpRequest.prototype.open;
  //   XMLHttpRequest.prototype.open = function() {
  //       this.addEventListener("load", function() {
  //           var message = {"status" : this.status, "response" : this.response}
  //           window.ReactNativeWebView.postMessage(JSON.stringify(message));
  //       });
  //       open.apply(this, arguments);
  //   };})();`;

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={{flexDirection: 'column', margin: 16}}>
        {/* <Text
          style={{
            marginBottom: 8,
          }}>{`포그라운드 시간 : ${lastTransition}`}</Text>
        <Text
          style={{
            marginBottom: 8,
          }}>{`백그라운드 시간 : ${lastTransition}`}</Text>
        <Text
          style={{
            marginBottom: 8,
          }}>{`각 사이트 들어간 시간`}</Text>
        <Text
          style={{
            marginBottom: 8,
          }}>{`일베 : ${webListInfo?.[0]?.entranceTime}`}</Text>
        <Text
          style={{
            marginBottom: 8,
          }}>{`디시 : ${webListInfo?.[1]?.entranceTime}`}</Text>
        <Text
          style={{
            marginBottom: 8,
          }}>{`네이버 : ${webListInfo?.[2]?.entranceTime}`}</Text>
           <Text
          style={{
            marginBottom: 8,
          }}>{`블라인드 : ${webListInfo?.[3]?.entranceTime}`}</Text> */}
        <Text
          style={{
            marginBottom: 8,
          }}>{`특정 버튼 : ${messageFromWebView}`}</Text>
      </View>

      <View style={{flex: 0.2, flexDirection: 'row'}}>
        {siteList?.map((list, i) => {
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleWebviewUrl(webListInfo?.[i]?.url, i)}
              style={{margin: 16}}>
              <Text>{list.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{flex: 1}}>
        <WebView
          source={{uri: webUrl}}
          onMessage={onWebViewMessage}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          // ref={webviewRef}
          setSupportMultipleWindows={false}
          // startInLoadingState={true}
          // renderLoading={() => <div>Loading...</div>}
          allowsBackForwardNavigationGestures={true}
          onNavigationStateChange={handleWebViewNavigationStateChange}
        />
      </View>
    </SafeAreaView>
  );
}

export default App;
