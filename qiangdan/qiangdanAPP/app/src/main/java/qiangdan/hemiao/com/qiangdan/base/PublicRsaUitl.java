package qiangdan.hemiao.com.qiangdan.base;
import java.io.ByteArrayOutputStream;
import java.security.Key;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;

import javax.crypto.Cipher;

/**
 * rsa 公钥
 * @author zrh
 * 2016.04.16
 *
 */
public class PublicRsaUitl {
	private static final String RSA = "RSA";
	 /* 解决Android和服务器默认的一致 */  
	private static final String AES_CBC = "RSA/ECB/PKCS1Padding";
	private static final String SHA1WITHRSA = "SHA1withRSA";
	private static final String DEFAULT_URL_ENCODING = "UTF-8";
	 /** *//** 
     * RSA最大加密明文大小 
     */  
    private static final int MAX_ENCRYPT_BLOCK = 117;  
      
    /** *//** 
     * RSA最大解密密文大小 
     */  
    private static final int MAX_DECRYPT_BLOCK = 128;  
	
	private byte[] pub_data=null;
	private static PublicRsaUitl rsaUitl=null;
	
	private static final String PUBLIC_KEY = "30819f300d06092a864886f70d010101050003818d0030818902818100810132397ce34813e0d07ce0c6048e8c6b2f1f0c290fc4d42dfaa28b834bc39b1cc016852e0c4578e7d14cc23226160da46b349505d5e2508fd1e7a5527f214f23fe9f8e2bc66de037c8b17657c62071e46e39ec35b47cd8ce55a631c8526e6b578091dae7bbccecafdeaa30b89a6d60de106dd9651d5028de912397d2229ebd0203010001";
	
	
	
	public PublicRsaUitl(){
		pub_data = hexStrToBytes(PUBLIC_KEY);
	}
	public static PublicRsaUitl getInstance(){
		return rsaUitl==null?new PublicRsaUitl():rsaUitl;
	}
	
	
	
   /**
    * （验证）公钥验证数字签名的信息。
    * @Title: 
    * @param signInfo 数字签之后的信息（16进制）
    * @param oldInfo 原字符串
    * @return
    * @return boolean
    * @author zrh
    */
   public boolean verify(String signInfo, String oldInfo) {
		try {
			//公钥
			X509EncodedKeySpec bobPubKeySpec = new X509EncodedKeySpec(pub_data);
			KeyFactory keyFactory = KeyFactory.getInstance(RSA);
			PublicKey pubKey = keyFactory.generatePublic(bobPubKeySpec);
			
			java.security.Signature signetcheck=java.security.Signature.getInstance(SHA1WITHRSA); //MD5withRSA
			signetcheck.initVerify(pubKey);
			signetcheck.update(oldInfo.getBytes(DEFAULT_URL_ENCODING));
			
			//加密之后内容
			byte[] signed = hexStrToBytes(signInfo);//数字签名过的信息
			boolean b = signetcheck.verify(signed);
			if (b) {
//				System.out.println("验证数字正常");
			}
//			else System.out.println("非签名正常");
		  return b;
	    }catch (Exception e) {
			e.printStackTrace();
		}
       return false;
	}
   /**
    * 公钥加密
    * @Title: 
    * @param jmStr
    * @return String 16进制加密字符串
    * @author zrh
    */
   public String JiaMiByPub(String jmStr) {
		try {
           byte[] data = jmStr.getBytes(DEFAULT_URL_ENCODING);
           
           X509EncodedKeySpec pub_spec = new X509EncodedKeySpec(pub_data);
		   KeyFactory mykeyFactory = KeyFactory.getInstance(RSA);
		   PublicKey pubKey = mykeyFactory.generatePublic(pub_spec);
		   Cipher cipher = Cipher.getInstance(AES_CBC);
		   cipher.init(Cipher.ENCRYPT_MODE, pubKey);
//		   byte[]  resultdata= cipher.doFinal(data);
		   byte[] resultdata=jiaMiSub(data, cipher);
		   
		   String relStr=bytesToHexStr(resultdata);
//		   System.out.println("加密成功!");
		   return relStr;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("签名并生成文件失败");
		}
		return null;
   }
   
  
   /**
    * 公钥解密
    * @Title: 
    * @param str16 解密后的数据(16进制字符串)
    * @return
    * @return String
    * @author zrh
    */
   public String JieMiByPub(String str16) {
	   try{
		   X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(pub_data);
	       KeyFactory keyFactory = KeyFactory.getInstance(RSA);
	       Key publicK = keyFactory.generatePublic(x509KeySpec);
	       Cipher cipher = Cipher.getInstance(AES_CBC);
	       cipher.init(Cipher.DECRYPT_MODE, publicK);
	       
	       //加密后的内容
		   byte[] data = hexStrToBytes(str16);
//	       byte[] resultdate = cipher.doFinal(data);//解密
		   byte[] resultdata = jieMiSub(data, cipher);
	       return new String(resultdata,DEFAULT_URL_ENCODING);
	   } catch (Exception e){
		// TODO: handle exception
	   }
	  
	   return null;
   }
   
   public static void main(String[] args) {
	   //aes加密数据。rsa加密aes密钥。数据通信时，把加密数据和机密aes密钥一块传过去。
	
   	
   }
   /**
    * 分段加密
    * @Title: 
    * @param data
    * @param cipher
    * @throws Exception
    * @return 加密后内容
    * @author zrh
    */
   private byte[] jiaMiSub(byte[] data ,Cipher cipher) throws Exception {
	   int inputLen = data.length;  
       ByteArrayOutputStream out = new ByteArrayOutputStream();
       int offSet = 0;  
       byte[] cache;  
       int i = 0;  
       // 对数据分段加密  
       while (inputLen - offSet > 0) {  
           if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {  
               cache = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);  
           } else {  
               cache = cipher.doFinal(data, offSet, inputLen - offSet);  
           }  
           out.write(cache, 0, cache.length);  
           i++;  
           offSet = i * MAX_ENCRYPT_BLOCK;  
       }  
       byte[] encryptedData = out.toByteArray();  
       out.close();  
       return encryptedData;
   }
   /**
    * 分段解密
    * @Title: 
    * @param data
    * @param cipher
    * @return
    * @throws Exception
    * @return byte[] 解密后内容
    * @author zrh
    */
   private byte[] jieMiSub(byte[] data ,Cipher cipher) throws Exception {
	   int inputLen = data.length;  
       ByteArrayOutputStream out = new ByteArrayOutputStream();
       int offSet = 0;  
       byte[] cache;  
       int i = 0;  
       // 对数据分段解密  
       while (inputLen - offSet > 0) {  
           if (inputLen - offSet > MAX_DECRYPT_BLOCK) {  
               cache = cipher.doFinal(data, offSet, MAX_DECRYPT_BLOCK);  
           } else {  
               cache = cipher.doFinal(data, offSet, inputLen - offSet);  
           }  
           out.write(cache, 0, cache.length);  
           i++;  
           offSet = i * MAX_DECRYPT_BLOCK;  
       }  
       byte[] decryptedData = out.toByteArray();  
       out.close();  
       return decryptedData;
   }
   
   

/**
* Transform the specified byte into a Hex String form.
*/
public static final String bytesToHexStr(byte[] bcd) {
	StringBuffer s = new StringBuffer(bcd.length * 2);
	
	for (int i = 0; i < bcd.length; i++) {
		s.append(bcdLookup[(bcd[i] >>> 4) & 0x0f]);
		s.append(bcdLookup[bcd[i] & 0x0f]);
    }

    return s.toString();
}

/**
* Transform the specified Hex String into a byte array.
*/
public static final byte[] hexStrToBytes(String s) {
	byte[] bytes;
	
	bytes = new byte[s.length() / 2];
	
	for (int i = 0; i < bytes.length; i++) {
	bytes[i] = (byte) Integer.parseInt(s.substring(2 * i, 2 * i + 2),
	16);
	}
	
	return bytes;
}

private static final char[] bcdLookup = { '0', '1', '2', '3', '4', '5',
'6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };


}