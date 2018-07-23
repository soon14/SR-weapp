//
//  DetailViewController.h
//  hello
//
//  Created by 杨世锐 on 2018/7/22.
//  Copyright © 2018年 杨世锐. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController

@property (strong, nonatomic) NSDate *detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@end

